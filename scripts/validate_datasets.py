"""
Dataset Validation & Health Verification Script.
Validates file integrity, detects corrupt image/text files, inspects label distributions,
and generates comprehensive data quality reports.
"""

import os
import sys
import json
import hashlib
from pathlib import Path
from PIL import Image
from collections import Counter

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"


def verify_image_file(filepath: Path) -> bool:
    try:
        with Image.open(filepath) as img:
            img.verify()
        with Image.open(filepath) as img:
            img.load()
        return True
    except Exception:
        return False


def validate_split(split_name: str):
    split_dir = DATA_DIR / split_name
    index_file = split_dir / "index.json"

    if not index_file.exists():
        return {
            "status": "MISSING",
            "error": f"Index file {index_file} not found."
        }

    with open(index_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    certs = data.get("certificates", [])
    lors = data.get("lors", [])

    corrupted_images = []
    missing_files = []
    tampering_distribution = Counter()
    lor_issues_distribution = Counter()

    for item in certs:
        img_path = BASE_DIR / item["image_path"]
        mask_path = BASE_DIR / item["mask_path"]

        if not img_path.exists():
            missing_files.append(str(img_path))
            continue
        if not mask_path.exists():
            missing_files.append(str(mask_path))
            continue

        if not verify_image_file(img_path):
            corrupted_images.append(str(img_path))
        if not verify_image_file(mask_path):
            corrupted_images.append(str(mask_path))

        tampering_distribution[item.get("tampering_type", "unknown")] += 1

    for item in lors:
        txt_path = BASE_DIR / item["file_path"]
        if not txt_path.exists():
            missing_files.append(str(txt_path))
            continue
        lor_issues_distribution[item.get("issue", "unknown")] += 1

    is_healthy = (len(corrupted_images) == 0 and len(missing_files) == 0)

    return {
        "status": "VALID" if is_healthy else "ISSUES_DETECTED",
        "certificates_count": len(certs),
        "lors_count": len(lors),
        "corrupted_images": corrupted_images,
        "missing_files": missing_files,
        "tampering_distribution": dict(tampering_distribution),
        "lor_issues_distribution": dict(lor_issues_distribution)
    }


def main():
    print("==================================================")
    print("  KANA-FORGE DATASET INTEGRITY & VALIDATION REPORT")
    print("==================================================")

    # Check raw datasets status
    raw_status = {}
    raw_dirs = {
        "academic_certificates": DATA_DIR / "raw" / "academic_certificates",
        "doctamper": DATA_DIR / "raw" / "doctamper",
        "tdoc": DATA_DIR / "raw" / "tdoc",
        "staver": DATA_DIR / "raw" / "staver",
        "cedar": DATA_DIR / "raw" / "cedar",
        "funsd": DATA_DIR / "raw" / "funsd",
        "sidtd": DATA_DIR / "raw" / "sidtd",
        "aiforge": DATA_DIR / "raw" / "aiforge",
        "lor": DATA_DIR / "raw" / "lor"
    }

    print("\n--- 1. Raw Dataset Status ---")
    for key, path in raw_dirs.items():
        exists = path.exists()
        files_count = len(list(path.glob("*.*"))) if exists else 0
        if files_count > 0:
            status = f"AVAILABLE ({files_count} files)"
        elif exists:
            status = "DIRECTORY_CREATED (Awaiting manual placement / Restricted access)"
        else:
            status = "NOT_INITIALIZED"
        raw_status[key] = status
        print(f"  {key:<22}: {status}")

    print("\n--- 2. Dataset Splits Validation ---")
    report = {"raw_datasets": raw_status, "splits": {}}

    for split in ["train", "validation", "test"]:
        res = validate_split(split)
        report["splits"][split] = res
        print(f"\nSplit: [{split.upper()}]")
        print(f"  Status             : {res['status']}")
        if res.get("status") == "VALID":
            print(f"  Certificates Count : {res['certificates_count']}")
            print(f"  LORs Count         : {res['lors_count']}")
            print(f"  Tampering Classes  : {res['tampering_distribution']}")
            print(f"  LOR Anomaly Classes: {res['lor_issues_distribution']}")
        else:
            print(f"  Corrupt files      : {len(res.get('corrupted_images', []))}")
            print(f"  Missing files      : {len(res.get('missing_files', []))}")

    out_file = DATA_DIR / "validation_report.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print(f"\n[OK] Validation complete. Full report written to {out_file}")


if __name__ == "__main__":
    main()
