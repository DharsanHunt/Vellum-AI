"""
Synthetic Letter of Recommendation (LOR) Dataset Generator.
Generates fictional academic and industrial recommendation letters with controlled semantic,
entity, and cross-document inconsistencies (VALID, NAME_MISMATCH, INSTITUTION_MISMATCH,
DATE_MISMATCH, DESIGNATION_MISMATCH, RELATIONSHIP_MISMATCH, PROJECT_MISMATCH, COPY_TEXT,
CONTRADICTORY_CLAIM).
"""

import os
import random
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "data" / "synthetic" / "lor"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

STUDENTS = [
    {"name": "Arun Kumar", "degree": "B.Tech Computer Science", "batch": "2020-2024", "uni": "Apex University of Technology"},
    {"name": "Priya Sharma", "degree": "B.Sc Information Technology", "batch": "2019-2023", "uni": "Global Institute of Science & Engineering"},
    {"name": "Aditya Verma", "degree": "Master of Science in AI", "batch": "2021-2023", "uni": "National Institute of Higher Studies"},
    {"name": "Sneha Patel", "degree": "B.E. Electronics Engineering", "batch": "2020-2024", "uni": "Metropolitan University of Computing"},
    {"name": "Rahul Deshmukh", "degree": "B.Tech Computer Science", "batch": "2019-2023", "uni": "Pacific Coast University"}
]

PROFESSORS = [
    {"name": "Dr. Arvind Swaminathan", "designation": "Professor & Head of Department", "department": "Computer Science & Engineering", "uni": "Apex University of Technology"},
    {"name": "Dr. Meenakshi Sundaram", "designation": "Associate Professor", "department": "Information Science", "uni": "Global Institute of Science & Engineering"},
    {"name": "Dr. Rajeshwar Rao", "designation": "Senior Research Director", "department": "Artificial Intelligence Lab", "uni": "National Institute of Higher Studies"},
    {"name": "Prof. Elena Rostova", "designation": "Distinguished Professor", "department": "Robotics & Automation", "uni": "Metropolitan University of Computing"},
    {"name": "Dr. K. V. Ramanathan", "designation": "Dean of Academic Research", "department": "Electrical & Computer Systems", "uni": "Pacific Coast University"}
]

PROJECTS = [
    "Distributed Consensus in Fault-Tolerant Blockchain Networks",
    "Real-Time Deep Learning for Autonomous Mobile Perception",
    "Graph Neural Networks for Large-Scale Knowledge Graph Completion",
    "Privacy-Preserving Federated Learning on Edge Devices",
    "High-Throughput Microservice Architecture for Cloud Streaming"
]

SKILLS_POOL = [
    ["Python", "PyTorch", "Distributed Systems", "Kubernetes"],
    ["C++", "CUDA", "Embedded Robotics", "ROS2"],
    ["Natural Language Processing", "Transformers", "FastAPI", "PostgreSQL"],
    ["Computer Vision", "OpenCV", "TensorFlow", "Edge AI"]
]

BOILERPLATE_TEMPLATES = [
    "It is my absolute pleasure to write this letter of recommendation for {student_name}, who was under my direct supervision for 3 years at {institution}. {student_name} ranks in the top 2% of students I have taught in my 20-year academic career.",
    "I am delighted to recommend {student_name} for admission to your prestigious postgraduate program. As {designation} at {institution}, I have closely observed their exemplary dedication to academic rigor.",
    "Please accept this formal letter of recommendation for {student_name}. During their tenure at {institution}, {student_name} served as a core researcher on '{project}' and demonstrated unmatched analytical problem-solving skills."
]

ISSUES = [
    "VALID",
    "NAME_MISMATCH",
    "INSTITUTION_MISMATCH",
    "DATE_MISMATCH",
    "DESIGNATION_MISMATCH",
    "RELATIONSHIP_MISMATCH",
    "PROJECT_MISMATCH",
    "COPY_TEXT",
    "CONTRADICTORY_CLAIM"
]


def generate_single_lor(index: int, issue_type: str = "VALID"):
    student = random.choice(STUDENTS)
    prof = random.choice(PROFESSORS)
    project = random.choice(PROJECTS)
    skills = random.choice(SKILLS_POOL)
    
    student_name = student["name"]
    institution = prof["uni"]
    recommender_name = prof["name"]
    designation = prof["designation"]
    department = prof["department"]
    relationship = "Thesis Advisor & Course Instructor"
    tenure_years = "3 years"
    dates_taught = student["batch"]
    claimed_gpa = "9.4 / 10.0"
    
    status = "VALID" if issue_type == "VALID" else "CONFLICT"
    issue_description = "Recommendation letter is fully consistent with candidate credentials."
    
    # Controlled anomaly injections
    if issue_type == "NAME_MISMATCH":
        corrupted_name = f"{student_name.split()[0]} Rajendra {student_name.split()[-1]}"
        text_student_name = corrupted_name
        issue_description = f"Student name inside letter body ('{corrupted_name}') differs from verified profile ('{student_name}')."
    else:
        text_student_name = student_name
        
    if issue_type == "INSTITUTION_MISMATCH":
        corrupted_uni = "Fake Stanford Affiliate College of Technology"
        text_institution = corrupted_uni
        issue_description = f"Recommender institution '{corrupted_uni}' contradicts university records for '{student['uni']}'."
    else:
        text_institution = prof["uni"]
        
    if issue_type == "DATE_MISMATCH":
        corrupted_dates = "2012-2015"
        dates_taught = corrupted_dates
        issue_description = f"Dates of association ({corrupted_dates}) completely predate student's actual enrollment ({student['batch']})."
        
    if issue_type == "DESIGNATION_MISMATCH":
        corrupted_desig = "Undergraduate Peer Tutor & Lab Assistant"
        designation = corrupted_desig
        issue_description = "Recommender claims tenure as Department Chair but letter signature denotes student peer tutor."
        
    if issue_type == "RELATIONSHIP_MISMATCH":
        relationship = "Personal Family Friend and Distant Relative"
        issue_description = "Recommender relationship is non-academic/personal rather than verified academic supervisor."
        
    if issue_type == "PROJECT_MISMATCH":
        project = "Civil Concrete Stress Analysis and Highway Asphalt Durability"
        issue_description = f"Recommender praises project '{project}' which contradicts candidate's degree curriculum in {student['degree']}."
        
    if issue_type == "CONTRADICTORY_CLAIM":
        issue_description = "Letter makes contradictory claim stating candidate graduated #1 class valedictorian in a non-graduating freshman semester."
        
    if issue_type == "COPY_TEXT":
        # Verbatim standardized commercial template
        text_body = (
            f"To Whom It May Concern,\n\n"
            f"I am writing this standard letter for {text_student_name} who studied at {text_institution}. "
            f"The candidate is a hard working individual who attends all lectures on time. "
            f"They have good communication skills and would be a valuable asset to your institution. "
            f"Please feel free to contact me if you require further generic information.\n\n"
            f"Sincerely,\n{recommender_name}\n{designation}\n{text_institution}"
        )
        issue_description = "Verbatim generic copypaste template detected with zero personalized technical contributions."
    else:
        # Rich structured recommendation letter
        text_body = (
            f"DEPARTMENT OF {department.upper()}\n"
            f"{text_institution.upper()}\n"
            f"Date: October 24, 2024\n\n"
            f"To the Graduate Admissions Committee,\n\n"
            f"I am writing to offer my enthusiastic recommendation for {text_student_name}, "
            f"who I have mentored as {relationship} during their study period ({dates_taught}) at {text_institution}.\n\n"
            f"During this tenure, {text_student_name} demonstrated exceptional mastery in {', '.join(skills)}. "
            f"In our research laboratory, they led the pivotal development of '{project}', "
            f"exhibiting remarkable technical intuition, rigorous experimental discipline, and intellectual maturity. "
            f"{'Additionally, the candidate maintained an exemplary academic record with a GPA of ' + claimed_gpa + '.' if issue_type != 'CONTRADICTORY_CLAIM' else 'Remarkably, they graduated as the 4-year valedictorian after their 1st semester.'}\n\n"
            f"Beyond technical competence, {text_student_name} displays genuine leadership, integrity, and proactive collaboration. "
            f"I rank {text_student_name} among the top 1% of researchers I have supervised. "
            f"I strongly recommend them for admission and financial fellowship without reservation.\n\n"
            f"Warm regards,\n\n"
            f"{recommender_name}\n"
            f"{designation}\n"
            f"{department}\n"
            f"{text_institution}\n"
            f"Email: {recommender_name.lower().replace(' ', '.').replace('dr.', '')}@{text_institution.lower().replace(' ', '').replace('&', '')[:10]}.edu"
        )
        
    metadata = {
        "id": f"lor_{index:05d}",
        "status": status,
        "issue": issue_type.lower(),
        "issue_description": issue_description,
        "is_valid": issue_type == "VALID",
        "entities": {
            "student_name": text_student_name,
            "recommender": recommender_name,
            "designation": designation,
            "institution": text_institution,
            "relationship": relationship,
            "project": project,
            "skills": skills,
            "dates_taught": dates_taught
        },
        "text": text_body
    }
    
    return metadata


def generate_lor_dataset(num_samples: int = 120):
    print(f"[*] Generating {num_samples} synthetic recommendation letters across all 9 anomaly classes...")
    
    lor_list = []
    for i in range(num_samples):
        # 35% valid, 65% controlled issues
        if i % 3 == 0:
            issue = "VALID"
        else:
            issue = random.choice([x for x in ISSUES if x != "VALID"])
            
        sample = generate_single_lor(i, issue_type=issue)
        
        # Save individual txt and json
        txt_path = OUTPUT_DIR / f"{sample['id']}.txt"
        json_path = OUTPUT_DIR / f"{sample['id']}.json"
        
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(sample["text"])
            
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(sample, f, indent=2)
            
        sample["file_path"] = str(txt_path.relative_to(BASE_DIR))
        lor_list.append(sample)
        
    manifest_path = OUTPUT_DIR / "lor_dataset_manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(lor_list, f, indent=2)
        
    print(f"[OK] Generated {len(lor_list)} LOR samples at {OUTPUT_DIR}")
    print(f"[OK] Manifest saved at {manifest_path}")


if __name__ == "__main__":
    generate_lor_dataset(num_samples=120)
