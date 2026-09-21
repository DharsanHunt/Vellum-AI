"""
High-Fidelity Synthetic Academic Certificate & Tampering Dataset Generator.
Generates realistic degree certificates, diplomas, transcripts, and controlled forged variants
alongside exact pixel-level ground-truth tampering masks and entity metadata.
"""

import os
import random
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "data" / "synthetic" / "certificates"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Synthetic entity pools
UNIVERSITIES = [
    ("Apex University of Technology", "Dean of Academic Affairs", "AUST-"),
    ("Global Institute of Science & Engineering", "Registrar & Controller of Examinations", "GISE-"),
    ("National Institute of Higher Studies", "Director of Certification", "NIHS-"),
    ("Metropolitan University of Computing", "Vice Chancellor", "MUC-"),
    ("Pacific Coast University", "Dean of Engineering", "PCU-"),
    ("Stanford Tech Research Institute", "Academic Provost", "STRI-")
]

DEGREES = [
    ("Bachelor of Technology in Computer Science", "B.Tech (CSE)"),
    ("Bachelor of Science in Information Technology", "B.Sc (IT)"),
    ("Master of Science in Artificial Intelligence", "M.Sc (AI)"),
    ("Master of Business Administration in Data Analytics", "MBA"),
    ("Bachelor of Engineering in Electronics", "B.E. (ECE)")
]

NAMES = [
    "Arun Kumar", "Priya Sharma", "Aditya Verma", "Sneha Patel",
    "Rahul Deshmukh", "Ananya Sundaram", "Vikram Malhotra", "Kavita Reddy",
    "Rohan Gupta", "Deepika Joshi", "Nikhil Nair", "Meera Iyer"
]

TAMPERED_NAMES = [
    "Arjun Kumar", "Pooja Sharma", "Amit Verma", "Shreya Patel",
    "Rajesh Deshmukh", "Ananya Menon", "Vishal Malhotra", "Divya Reddy"
]

TAMPERING_TYPES = [
    "clean",
    "changed_name",
    "changed_date",
    "changed_certificate_number",
    "changed_institution",
    "changed_course",
    "removed_signature",
    "modified_stamp",
    "copy_paste_region"
]


def draw_curved_signature(draw, x_start, y_start, width, height, color=(20, 30, 90, 240)):
    """Draw a realistic synthetic cursive signature curve."""
    points = []
    curr_x = x_start
    curr_y = y_start + height // 2
    points.append((curr_x, curr_y))
    
    steps = random.randint(12, 20)
    step_dx = width / steps
    for i in range(steps):
        curr_x += step_dx + random.uniform(-2, 4)
        curr_y += random.uniform(-height * 0.4, height * 0.4)
        points.append((int(curr_x), int(curr_y)))
    
    # Draw smooth splines/segments
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill=color, width=random.randint(2, 3))
    
    # Add a flourish loop
    loop_center = (x_start + int(width * 0.7), y_start + height // 2)
    draw.arc([loop_center[0] - 15, loop_center[1] - 10, loop_center[0] + 25, loop_center[1] + 15],
             start=0, end=300, fill=color, width=2)


def draw_official_stamp(img, center_x, center_y, radius, text="VERIFIED OFFICIAL SEAL", color=(180, 20, 30, 200)):
    """Draw an official circular institutional stamp with text and stars."""
    stamp_layer = Image.new("RGBA", img.size, (255, 255, 255, 0))
    sdraw = ImageDraw.Draw(stamp_layer)
    
    # Concentric circles
    sdraw.ellipse([center_x - radius, center_y - radius, center_x + radius, center_y + radius],
                  outline=color, width=3)
    sdraw.ellipse([center_x - radius + 8, center_y - radius + 8, center_x + radius - 8, center_y + radius - 8],
                  outline=color, width=1)
    
    # Inner emblem or star
    sdraw.polygon([
        (center_x, center_y - 12),
        (center_x + 4, center_y - 4),
        (center_x + 12, center_y - 4),
        (center_x + 6, center_y + 2),
        (center_x + 8, center_y + 10),
        (center_x, center_y + 5),
        (center_x - 8, center_y + 10),
        (center_x - 6, center_y + 2),
        (center_x - 12, center_y - 4),
        (center_x - 4, center_y - 4)
    ], fill=color)
    
    sdraw.text((center_x - 32, center_y + 14), "ACADEMIC", fill=color)
    sdraw.text((center_x - 28, center_y - 24), "OFFICIAL", fill=color)
    
    # Alpha blend onto document
    img.alpha_composite(stamp_layer)


def generate_single_certificate(index: int, tampering_type: str = "clean"):
    """
    Generates a pristine certificate and optionally applies controlled tampering,
    returning (pristine_img, modified_img, mask_img, metadata).
    """
    width, height = 1000, 700
    
    # 1. Base certificate parchment background
    base_img = Image.new("RGBA", (width, height), (250, 248, 240, 255))
    draw = ImageDraw.Draw(base_img)
    
    # 2. Ornate Border
    draw.rectangle([20, 20, width - 20, height - 20], outline=(160, 130, 70), width=4)
    draw.rectangle([28, 28, width - 28, height - 28], outline=(200, 175, 110), width=2)
    draw.rectangle([34, 34, width - 34, height - 34], outline=(160, 130, 70), width=1)
    
    # Data selection
    uni_name, authority, cert_prefix = random.choice(UNIVERSITIES)
    degree_name, degree_abbr = random.choice(DEGREES)
    student_name = random.choice(NAMES)
    cert_no = f"{cert_prefix}{20230000 + index}"
    reg_no = f"REG{random.randint(100000, 999999)}"
    issue_date = f"15th July {random.randint(2021, 2024)}"
    grade = f"{random.choice(['First Class with Distinction', 'First Class Honours', 'Grade A+'])} (CGPA: {round(random.uniform(8.2, 9.8), 2)})"
    
    # Text coordinates tracking for entity ground truth
    text_color = (25, 25, 30, 255)
    header_color = (120, 20, 30, 255)
    gold_color = (160, 120, 30, 255)
    
    # Certificate Header
    draw.text((width // 2 - 220, 70), uni_name.upper(), fill=header_color)
    draw.line([(width // 2 - 180, 100), (width // 2 + 180, 100)], fill=gold_color, width=2)
    
    draw.text((width // 2 - 140, 125), "CERTIFICATE OF GRADUATION", fill=(50, 50, 60))
    draw.text((width // 2 - 120, 160), "This is to certify that", fill=(90, 90, 100))
    
    # Student Name
    name_pos = (width // 2 - 100, 200)
    draw.text(name_pos, student_name, fill=header_color)
    draw.line([(width // 2 - 150, 230), (width // 2 + 150, 230)], fill=(180, 180, 190), width=1)
    
    # Degree info
    draw.text((width // 2 - 210, 260), "has successfully completed the curriculum and fulfilled all requirements for", fill=(70, 70, 80))
    draw.text((width // 2 - 170, 300), degree_name, fill=text_color)
    draw.text((width // 2 - 130, 340), f"with {grade}", fill=(40, 40, 45))
    
    # Metadata fields
    draw.text((80, 430), f"Certificate No: {cert_no}", fill=(70, 70, 80))
    draw.text((80, 460), f"Registration No: {reg_no}", fill=(70, 70, 80))
    draw.text((80, 490), f"Date of Issue: {issue_date}", fill=(70, 70, 80))
    
    # Signature Areas
    sig1_x, sig1_y = 650, 480
    draw.line([(sig1_x, sig1_y + 40), (sig1_x + 200, sig1_y + 40)], fill=(80, 80, 90), width=1)
    draw.text((sig1_x + 30, sig1_y + 48), authority, fill=(60, 60, 70))
    draw_curved_signature(draw, sig1_x + 20, sig1_y, 160, 35)
    
    # Official Stamp
    stamp_center = (450, 510)
    draw_official_stamp(base_img, stamp_center[0], stamp_center[1], radius=45)
    
    # Save a pristine copy
    pristine_img = base_img.convert("RGB")
    
    # Tampering generation & Ground-truth mask
    modified_img = pristine_img.copy()
    mask = Image.new("L", (width, height), 0) # 0 = pristine, 255 = tampered
    m_draw = ImageDraw.Draw(mask)
    mod_draw = ImageDraw.Draw(modified_img)
    
    tamper_bbox = None
    tamper_explanation = "Pristine Authentic Document"
    
    if tampering_type == "changed_name":
        # Splicing / text replacement on student name
        alt_name = random.choice(TAMPERED_NAMES)
        tamper_bbox = [width // 2 - 155, 195, width // 2 + 155, 235]
        # Cover old name with parchment patch
        mod_draw.rectangle(tamper_bbox, fill=(250, 248, 240))
        # Draw altered name in slightly mismatched font weight / color
        mod_draw.text((name_pos[0] - 10, name_pos[1]), alt_name, fill=(10, 10, 15))
        m_draw.rectangle(tamper_bbox, fill=255)
        tamper_explanation = f"Potential name alteration detected: replaced '{student_name}' with '{alt_name}'"
        student_name = alt_name
        
    elif tampering_type == "changed_date":
        tamper_bbox = [75, 485, 320, 515]
        mod_draw.rectangle(tamper_bbox, fill=(250, 248, 240))
        forged_date = "29th February 2026"
        mod_draw.text((80, 490), f"Date of Issue: {forged_date}", fill=(10, 10, 20))
        m_draw.rectangle(tamper_bbox, fill=255)
        tamper_explanation = f"Date of issue modification detected near timestamp field: '{forged_date}'"
        issue_date = forged_date
        
    elif tampering_type == "changed_certificate_number":
        tamper_bbox = [75, 425, 350, 455]
        mod_draw.rectangle(tamper_bbox, fill=(250, 248, 240))
        forged_cert = f"{cert_prefix}99999999"
        mod_draw.text((80, 430), f"Certificate No: {forged_cert}", fill=(0, 0, 0))
        m_draw.rectangle(tamper_bbox, fill=255)
        tamper_explanation = f"Certificate ID modification detected near serial number field: '{forged_cert}'"
        cert_no = forged_cert
        
    elif tampering_type == "changed_institution":
        tamper_bbox = [width // 2 - 250, 60, width // 2 + 250, 105]
        mod_draw.rectangle(tamper_bbox, fill=(250, 248, 240))
        forged_uni = "Counterfeit Polytechnic Institute"
        mod_draw.text((width // 2 - 230, 70), forged_uni.upper(), fill=(140, 10, 20))
        m_draw.rectangle(tamper_bbox, fill=255)
        tamper_explanation = f"Header institution banner alteration detected: '{forged_uni}'"
        uni_name = forged_uni
        
    elif tampering_type == "changed_course":
        tamper_bbox = [width // 2 - 200, 295, width // 2 + 200, 335]
        mod_draw.rectangle(tamper_bbox, fill=(250, 248, 240))
        forged_course = "Doctor of Philosophy in Quantum Engineering"
        mod_draw.text((width // 2 - 210, 300), forged_course, fill=(10, 10, 10))
        m_draw.rectangle(tamper_bbox, fill=255)
        tamper_explanation = f"Curriculum / Degree title modification detected: '{forged_course}'"
        degree_name = forged_course
        
    elif tampering_type == "removed_signature":
        tamper_bbox = [sig1_x, sig1_y - 10, sig1_x + 200, sig1_y + 45]
        mod_draw.rectangle(tamper_bbox, fill=(250, 248, 240))
        # Re-draw the underlying line without signature
        mod_draw.line([(sig1_x, sig1_y + 40), (sig1_x + 200, sig1_y + 40)], fill=(80, 80, 90), width=1)
        m_draw.rectangle(tamper_bbox, fill=255)
        tamper_explanation = "Signature anomaly detected: erased or missing institutional authority signature"
        
    elif tampering_type == "modified_stamp":
        tamper_bbox = [stamp_center[0] - 50, stamp_center[1] - 50, stamp_center[0] + 50, stamp_center[1] + 50]
        # Inpaint / smudge stamp
        mod_draw.rectangle(tamper_bbox, fill=(250, 248, 240))
        draw_official_stamp(modified_img.convert("RGBA"), stamp_center[0], stamp_center[1], radius=35, text="VOID", color=(100, 100, 100, 180))
        m_draw.rectangle(tamper_bbox, fill=255)
        tamper_explanation = "Institutional seal anomaly: tampered or distorted seal verification profile"
        
    elif tampering_type == "copy_paste_region":
        # Copy patch from another location to forge registration
        tamper_bbox = [75, 455, 300, 485]
        crop_box = (100, 300, 325, 330)
        patch = pristine_img.crop(crop_box)
        modified_img.paste(patch, (tamper_bbox[0], tamper_bbox[1]))
        m_draw.rectangle(tamper_bbox, fill=255)
        tamper_explanation = "Copy-move splicing artifact detected in identity registration region"

    # Add realistic scanner noise / compression artifacts
    modified_rgb = modified_img.convert("RGB")
    
    metadata = {
        "id": f"cert_{index:05d}",
        "document_type": "ACADEMIC_CERTIFICATE",
        "tampering_type": tampering_type,
        "is_tampered": tampering_type != "clean",
        "tamper_bbox": tamper_bbox,
        "tamper_explanation": tamper_explanation,
        "entities": {
            "student_name": student_name,
            "institution": uni_name,
            "degree": degree_name,
            "certificate_number": cert_no,
            "registration_number": reg_no,
            "issue_date": issue_date,
            "grade": grade,
            "authority": authority
        }
    }
    
    return pristine_img, modified_rgb, mask, metadata


def generate_dataset(num_samples: int = 200):
    """Generates synthetic dataset samples with balanced clean and tampered splits."""
    print(f"[*] Generating {num_samples} synthetic certificates & tampering benchmarks...")
    
    metadata_list = []
    
    for i in range(num_samples):
        # 40% clean, 60% various tampering types
        if i % 3 == 0:
            ttype = "clean"
        else:
            ttype = random.choice([t for t in TAMPERING_TYPES if t != "clean"])
            
        pristine_img, mod_img, mask_img, meta = generate_single_certificate(i, tampering_type=ttype)
        
        sample_id = meta["id"]
        img_path = OUTPUT_DIR / f"{sample_id}.png"
        mask_path = OUTPUT_DIR / f"{sample_id}_mask.png"
        meta_path = OUTPUT_DIR / f"{sample_id}_meta.json"
        
        mod_img.save(img_path)
        mask_img.save(mask_path)
        
        meta["image_path"] = str(img_path.relative_to(BASE_DIR))
        meta["mask_path"] = str(mask_path.relative_to(BASE_DIR))
        
        with open(meta_path, "w") as f:
            json.dump(meta, f, indent=2)
            
        metadata_list.append(meta)
        
        if (i + 1) % 50 == 0 or i == num_samples - 1:
            print(f"  [+] Generated {i + 1}/{num_samples} certificates...")
            
    summary_path = OUTPUT_DIR / "dataset_manifest.json"
    with open(summary_path, "w") as f:
        json.dump(metadata_list, f, indent=2)
        
    print(f"[OK] Synthetic certificate dataset successfully created at {OUTPUT_DIR}")
    print(f"[OK] Total samples: {len(metadata_list)} | Manifest: {summary_path}")


if __name__ == "__main__":
    generate_dataset(num_samples=150)
