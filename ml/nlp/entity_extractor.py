"""
Multi-Strategy Entity Extraction Layer.
Combines spatial layout heuristics, regular expressions, pattern parsing,
and named entity recognition to extract key academic & verification fields.
"""

import re
from typing import Dict, Any, List, Optional
from rapidfuzz import fuzz


class EntityExtractor:
    def __init__(self):
        # Regex patterns for formal structured fields
        self.cert_no_pattern = re.compile(
            r'(?:Certificate\s*No|Cert\s*No|Certificate\s*ID|Serial\s*No|Diploma\s*No)[\s:\.\-]+([A-Z0-9\-]+)',
            re.IGNORECASE
        )
        self.reg_no_pattern = re.compile(
            r'(?:Registration\s*No|Reg\s*No|Roll\s*No|Student\s*ID|Enrollment\s*No)[\s:\.\-]+([A-Z0-9\-]+)',
            re.IGNORECASE
        )
        self.cgpa_pattern = re.compile(
            r'(?:CGPA|GPA|Grade\s*Point)[\s:\.\-]+([0-9]\.[0-9]{1,2})',
            re.IGNORECASE
        )
        self.percentage_pattern = re.compile(
            r'([0-9]{1,2}(?:\.[0-9]{1,2})?)\s*%',
            re.IGNORECASE
        )
        self.date_pattern = re.compile(
            r'(?:Date(?:\s*of\s*Issue)?|Issued\s*on|Dated)[\s:\.\-]+([0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+[0-9]{4}|[0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4}|[A-Za-z]+\s+[0-9]{1,2},?\s+[0-9]{4})',
            re.IGNORECASE
        )
        self.degree_keywords = [
            "Bachelor of Technology", "Bachelor of Science", "Bachelor of Engineering",
            "Master of Technology", "Master of Science", "Master of Business Administration",
            "Doctor of Philosophy", "B.Tech", "B.Sc", "B.E.", "M.Tech", "M.Sc", "MBA", "Ph.D"
        ]
        self.institution_keywords = [
            "University", "Institute", "College", "Academy", "Polytechnic", "School of"
        ]

    def extract_from_text_and_layout(self, text: str, lines: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Extracts entities from raw text body and structured OCR line bounding boxes.
        """
        entities = {
            "student_name": None,
            "institution": None,
            "certificate_number": None,
            "registration_number": None,
            "course": None,
            "degree": None,
            "dates": None,
            "issue_date": None,
            "marks": None,
            "cgpa": None,
            "percentage": None,
            "recommender": None,
            "designation": None,
            "company": None,
            "relationship": None
        }

        # 1. Regex field matches
        cert_match = self.cert_no_pattern.search(text)
        if cert_match:
            entities["certificate_number"] = cert_match.group(1).strip()

        reg_match = self.reg_no_pattern.search(text)
        if reg_match:
            entities["registration_number"] = reg_match.group(1).strip()

        cgpa_match = self.cgpa_pattern.search(text)
        if cgpa_match:
            entities["cgpa"] = cgpa_match.group(1).strip()

        perc_match = self.percentage_pattern.search(text)
        if perc_match:
            entities["percentage"] = perc_match.group(1).strip()

        date_match = self.date_pattern.search(text)
        if date_match:
            entities["issue_date"] = date_match.group(1).strip()
            entities["dates"] = date_match.group(1).strip()

        # 2. Institution identification
        for line in text.split("\n"):
            line_str = line.strip()
            if any(ikw.lower() in line_str.lower() for ikw in self.institution_keywords):
                if not entities["institution"] or len(line_str) > len(entities["institution"]):
                    entities["institution"] = line_str
                    break

        # 3. Degree / Course identification
        for deg in self.degree_keywords:
            if re.search(r'\b' + re.escape(deg) + r'\b', text, re.IGNORECASE):
                entities["degree"] = deg
                entities["course"] = deg
                break

        # 4. Student Name extraction (Heuristics: 'certify that <Name>', 'awarded to <Name>', 'recommendation for <Name>')
        certify_patterns = [
            re.compile(r'(?:certify\s+that|awarded\s+to|presented\s+to|recommendation\s+for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)', re.IGNORECASE),
            re.compile(r'(?:Student\s*Name|Candidate\s*Name)[\s:\.\-]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)', re.IGNORECASE)
        ]
        for cp in certify_patterns:
            m = cp.search(text)
            if m:
                entities["student_name"] = m.group(1).strip()
                break

        # 5. Recommender / Relationship / Designation
        rec_match = re.search(r'(?:Sincerely|Warm\s+regards|Regards|Yours\s+faithfully)[\s,\n]+([A-Z][a-z\.]+(?:\s+[A-Z][a-z]+)+)', text, re.IGNORECASE)
        if rec_match:
            entities["recommender"] = rec_match.group(1).strip()

        desig_match = re.search(r'(?:Professor|Associate\s+Professor|Dean|Director|Department\s+Head|Manager|Lead\s+Engineer)[^\n,]*', text, re.IGNORECASE)
        if desig_match:
            entities["designation"] = desig_match.group(0).strip()

        rel_match = re.search(r'(?:mentored\s+as|supervised\s+as|in\s+capacity\s+as)\s+([^,\n\.]+)', text, re.IGNORECASE)
        if rel_match:
            entities["relationship"] = rel_match.group(1).strip()

        return entities

    def normalize_name(self, name_str: Optional[str]) -> str:
        """Normalizes names by removing honorifics and standardizing whitespace."""
        if not name_str:
            return ""
        cleaned = re.sub(r'^(?:Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.)\s*', '', name_str.strip(), flags=re.IGNORECASE)
        return " ".join(cleaned.split()).lower()

    def compare_names(self, name1: Optional[str], name2: Optional[str]) -> Dict[str, Any]:
        """
        Compares two student/person names returning MATCH, MINOR_VARIATION, or CONFLICT.
        """
        if not name1 or not name2:
            return {"status": "UNKNOWN", "score": 0.0, "reason": "One or both names missing"}

        n1 = self.normalize_name(name1)
        n2 = self.normalize_name(name2)

        if n1 == n2:
            return {"status": "MATCH", "score": 1.0, "reason": "Exact match"}

        ratio = fuzz.ratio(n1, n2) / 100.0
        token_set_ratio = fuzz.token_sort_ratio(n1, n2) / 100.0

        if token_set_ratio >= 0.88 or ratio >= 0.85:
            return {
                "status": "MINOR_VARIATION",
                "score": max(ratio, token_set_ratio),
                "reason": f"Slight phonetic/spelling variation ('{name1}' vs '{name2}')"
            }
        else:
            return {
                "status": "CONFLICT",
                "score": ratio,
                "reason": f"Discrepancy detected ('{name1}' vs '{name2}')"
            }


if __name__ == "__main__":
    extractor = EntityExtractor()
    sample_text = """
    APEX UNIVERSITY OF TECHNOLOGY
    CERTIFICATE OF GRADUATION
    This is to certify that Arun Kumar has successfully completed
    Bachelor of Technology in Computer Science with First Class Honours (CGPA: 9.42).
    Certificate No: AUST-20230001
    Registration No: REG592819
    Date of Issue: 15th July 2024
    """
    res = extractor.extract_from_text_and_layout(sample_text)
    import json
    print(json.dumps(res, indent=2))
