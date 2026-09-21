"""
Cross-Document Verification Engine.
Builds an entity graph across candidate document portfolios (Certificates, Transcripts,
Internship Certificates, Recommendation Letters) and computes cross-document consistency
classifications (MATCH, MINOR_VARIATION, CONFLICT, UNKNOWN).
"""

from typing import Dict, List, Any, Optional
from rapidfuzz import fuzz
from ml.nlp.entity_extractor import EntityExtractor


class CrossDocumentVerifier:
    def __init__(self):
        self.extractor = EntityExtractor()

    def verify_portfolio(self, documents: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Verifies cross-document consistency across a set of processed documents.
        Each document item should contain:
            - doc_id: str
            - doc_type: str (e.g. 'CERTIFICATE', 'TRANSCRIPT', 'INTERNSHIP', 'LOR')
            - entities: Dict[str, Any] (or raw text/lines)
        """
        if not documents:
            return {
                "overall_status": "UNKNOWN",
                "consistency_score": 0.0,
                "conflicts": [],
                "field_comparisons": [],
                "entity_graph": {}
            }

        # Normalize entity representations
        normalized_docs = []
        for d in documents:
            ents = d.get("entities", {})
            if not ents and "text" in d:
                ents = self.extractor.extract_from_text_and_layout(d["text"])
            
            normalized_docs.append({
                "doc_id": d.get("doc_id", f"doc_{len(normalized_docs)}"),
                "doc_type": d.get("doc_type", "UNKNOWN"),
                "entities": ents
            })

        field_comparisons = []
        conflicts = []
        total_checks = 0
        passed_checks = 0

        # Pairwise comparison across documents
        n_docs = len(normalized_docs)
        for i in range(n_docs):
            for j in range(i + 1, n_docs):
                docA = normalized_docs[i]
                docB = normalized_docs[j]

                # 1. Compare Student Name
                nameA = docA["entities"].get("student_name")
                nameB = docB["entities"].get("student_name")
                if nameA and nameB:
                    total_checks += 1
                    comp = self.extractor.compare_names(nameA, nameB)
                    record = {
                        "field": "student_name",
                        "doc_a": docA["doc_id"],
                        "doc_b": docB["doc_id"],
                        "value_a": nameA,
                        "value_b": nameB,
                        "status": comp["status"],
                        "score": comp["score"],
                        "reason": comp["reason"]
                    }
                    field_comparisons.append(record)
                    if comp["status"] == "MATCH":
                        passed_checks += 1.0
                    elif comp["status"] == "MINOR_VARIATION":
                        passed_checks += 0.75
                    elif comp["status"] == "CONFLICT":
                        conflicts.append(record)

                # 2. Compare Institution
                instA = docA["entities"].get("institution")
                instB = docB["entities"].get("institution")
                if instA and instB:
                    total_checks += 1
                    sim = fuzz.token_set_ratio(instA.lower(), instB.lower()) / 100.0
                    if sim >= 0.85:
                        status = "MATCH"
                        passed_checks += 1.0
                        reason = "Institution names match"
                    elif sim >= 0.60:
                        status = "MINOR_VARIATION"
                        passed_checks += 0.70
                        reason = f"Abbreviation or partial institution match ('{instA}' vs '{instB}')"
                    else:
                        status = "CONFLICT"
                        reason = f"Institution mismatch ('{instA}' vs '{instB}')"

                    record = {
                        "field": "institution",
                        "doc_a": docA["doc_id"],
                        "doc_b": docB["doc_id"],
                        "value_a": instA,
                        "value_b": instB,
                        "status": status,
                        "score": sim,
                        "reason": reason
                    }
                    field_comparisons.append(record)
                    if status == "CONFLICT":
                        conflicts.append(record)

                # 3. Compare Degree / Course
                degA = docA["entities"].get("degree") or docA["entities"].get("course")
                degB = docB["entities"].get("degree") or docB["entities"].get("course")
                if degA and degB:
                    total_checks += 1
                    sim = fuzz.token_set_ratio(str(degA).lower(), str(degB).lower()) / 100.0
                    if sim >= 0.80:
                        status = "MATCH"
                        passed_checks += 1.0
                        reason = "Degree/Course title matches"
                    elif sim >= 0.50:
                        status = "MINOR_VARIATION"
                        passed_checks += 0.70
                        reason = f"Related degree specialization ('{degA}' vs '{degB}')"
                    else:
                        status = "CONFLICT"
                        reason = f"Degree field conflict ('{degA}' vs '{degB}')"

                    record = {
                        "field": "degree_course",
                        "doc_a": docA["doc_id"],
                        "doc_b": docB["doc_id"],
                        "value_a": degA,
                        "value_b": degB,
                        "status": status,
                        "score": sim,
                        "reason": reason
                    }
                    field_comparisons.append(record)
                    if status == "CONFLICT":
                        conflicts.append(record)

        consistency_score = round((passed_checks / total_checks), 3) if total_checks > 0 else 1.0

        if len(conflicts) > 0:
            overall_status = "CONFLICT"
        elif any(c["status"] == "MINOR_VARIATION" for c in field_comparisons):
            overall_status = "MINOR_VARIATION"
        elif total_checks > 0:
            overall_status = "MATCH"
        else:
            overall_status = "UNKNOWN"

        # Entity Graph nodes & edges
        nodes = []
        for d in normalized_docs:
            nodes.append({
                "id": d["doc_id"],
                "type": d["doc_type"],
                "entities": d["entities"]
            })

        edges = []
        for c in field_comparisons:
            edges.append({
                "source": c["doc_a"],
                "target": c["doc_b"],
                "field": c["field"],
                "status": c["status"],
                "score": c["score"]
            })

        return {
            "overall_status": overall_status,
            "consistency_score": consistency_score,
            "total_checks": total_checks,
            "conflicts_count": len(conflicts),
            "conflicts": conflicts,
            "field_comparisons": field_comparisons,
            "entity_graph": {
                "nodes": nodes,
                "edges": edges
            }
        }


if __name__ == "__main__":
    verifier = CrossDocumentVerifier()
    docs = [
        {
            "doc_id": "CERT_001",
            "doc_type": "ACADEMIC_CERTIFICATE",
            "entities": {
                "student_name": "Arun Kumar",
                "institution": "Apex University of Technology",
                "degree": "Bachelor of Technology in Computer Science"
            }
        },
        {
            "doc_id": "TRANSCRIPT_001",
            "doc_type": "TRANSCRIPT",
            "entities": {
                "student_name": "Arun Kumar",
                "institution": "Apex University of Technology",
                "degree": "B.Tech Computer Science"
            }
        },
        {
            "doc_id": "LOR_001",
            "doc_type": "LOR",
            "entities": {
                "student_name": "Arjun Kumar", # Anomaly mismatch
                "institution": "Apex University of Technology",
                "degree": "Computer Science"
            }
        }
    ]
    res = verifier.verify_portfolio(docs)
    import json
    print(json.dumps(res, indent=2))
