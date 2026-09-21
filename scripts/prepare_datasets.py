"""
Dataset Preparation & Normalization Script.
Processes raw and synthetic datasets into standardized formats, computes SHA-256 hashes,
extracts signature and stamp bounding boxes, and generates master dataset indices.
"""

import os
import sys
import json
import hashlib
from pathlib import Path
from PIL import Image
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
SYN_DIR = DATA_DIR / "synthetic"
PROCESSED_DIR = DATA_DIR / "processed"

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
(PROCESSED_DIR / "images").mkdir(parents=True, exist_ok=True)
(PROCESSED_DIR / "masks").mkdir(parents=True, exist_ok=True)
(PROCESSED_DIR / "signatures").mkdir(parents=True, exist_ok=True)
(PROCESSED_DIR / "stamps").mkdir(parents=True, exist_ok=True)


def get_sha256(filepath: Path) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def process_synthetic_certificates():
    cert_manifest = SYN_DIR / "certificates" / "dataset_manifest.json"
    if not cert_manifest.exists():
        print("[-] Synthetic certificate manifest not found. Run generate_certificate_dataset.py first.")
        return []

    with open(cert_manifest, "r", encoding="utf-8") as f:
        records = json.load(f)

    processed_records = []
    print(f"[*] Processing {len(records)} certificate samples...")

    for item in records:
        img_src = BASE_DIR / item["image_path"]
        mask_src = BASE_DIR / item["mask_path"]

        if not img_src.exists():
            continue

        try:
            with Image.open(img_src) as img:
                img_rgb = img.convert("RGB")
                target_img = PROCESSED_DIR / "images" / f"{item['id']}.png"
                img_rgb.save(target_img, "PNG")
                width, height = img_rgb.size
                
                # Extract signature crop for signature metric learning
                sig_crop = img_rgb.crop((650, 480, 850, 520))
                sig_target = PROCESSED_DIR / "signatures" / f"{item['id']}_sig.png"
                sig_crop.save(sig_target, "PNG")
                
                # Extract stamp crop
                stamp_crop = img_rgb.crop((400, 460, 500, 560))
                stamp_target = PROCESSED_DIR / "stamps" / f"{item['id']}_stamp.png"
                stamp_crop.save(stamp_target, "PNG")

            with Image.open(mask_src) as mask_img:
                mask_l = mask_img.convert("L")
                target_mask = PROCESSED_DIR / "masks" / f"{item['id']}_mask.png"
                mask_l.save(target_mask, "PNG")

            processed_item = {
                "id": item["id"],
                "type": "ACADEMIC_CERTIFICATE",
                "image_path": str(target_img.relative_to(BASE_DIR)),
                "mask_path": str(target_mask.relative_to(BASE_DIR)),
                "signature_crop": str(sig_target.relative_to(BASE_DIR)),
                "stamp_crop": str(stamp_target.relative_to(BASE_DIR)),
                "sha256": get_sha256(target_img),
                "width": width,
                "height": height,
                "is_tampered": item["is_tampered"],
                "tampering_type": item["tampering_type"],
                "tamper_explanation": item.get("tamper_explanation", ""),
                "entities": item.get("entities", {})
            }
            processed_records.append(processed_item)

        except Exception as e:
            print(f"[!] Error processing certificate {item['id']}: {e}")

    return processed_records


def process_synthetic_lors():
    lor_manifest = SYN_DIR / "lor" / "lor_dataset_manifest.json"
    if not lor_manifest.exists():
        print("[-] Synthetic LOR manifest not found. Run generate_lor_dataset.py first.")
        return []

    with open(lor_manifest, "r", encoding="utf-8") as f:
        records = json.load(f)

    processed_records = []
    print(f"[*] Processing {len(records)} LOR samples...")

    for item in records:
        txt_path = BASE_DIR / item["file_path"]
        if not txt_path.exists():
            continue

        processed_records.append({
            "id": item["id"],
            "type": "RECOMMENDATION_LETTER",
            "file_path": item["file_path"],
            "sha256": get_sha256(txt_path),
            "status": item["status"],
            "issue": item["issue"],
            "issue_description": item["issue_description"],
            "is_valid": item["is_valid"],
            "entities": item["entities"],
            "text": item["text"]
        })

    return processed_records


def main():
    print("==================================================")
    print("  KANA-FORGE DATASET PREPARATION & NORMALIZATION")
    print("==================================================")
    
    cert_data = process_synthetic_certificates()
    lor_data = process_synthetic_lors()

    master_manifest = {
        "certificates_count": len(cert_data),
        "lors_count": len(lor_data),
        "certificates": cert_data,
        "lors": lor_data
    }

    out_file = PROCESSED_DIR / "dataset_master_index.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(master_manifest, f, indent=2)

    print(f"\n[OK] Dataset preparation complete.")
    print(f"[OK] Processed {len(cert_data)} visual documents and {len(lor_data)} LOR documents.")
    print(f"[OK] Master index written to: {out_file}")


if __name__ == "__main__":
    main()
