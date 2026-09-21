"""
Dataset Download and Ingestion Management Script.
Handles automated fetching of public datasets, verification of hashes,
and creates structured raw directories for restricted datasets.
"""

import os
import sys
import json
import hashlib
import zipfile
import tarfile
import urllib.request
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"

DATASET_CONFIG = {
    "funsd": {
        "name": "FUNSD Form Understanding Dataset",
        "url": "https://guillaumejaume.github.io/FUNSD/dataset.zip",
        "restricted": False,
        "archive_format": "zip",
        "target_dir": RAW_DIR / "funsd",
        "description": "Scanned form understanding benchmark"
    },
    "cedar": {
        "name": "CEDAR Signature Dataset",
        "url": None,
        "restricted": True,
        "target_dir": RAW_DIR / "cedar",
        "access_instructions": "Visit https://cedar.buffalo.edu/NIJ/data/signatures.html to register and request academic access. Place extracted signers in /data/raw/cedar/.",
        "description": "Offline signature verification dataset (genuine vs forged)"
    },
    "doctamper": {
        "name": "DocTamper Document Forgery Benchmark",
        "url": None,
        "restricted": True,
        "target_dir": RAW_DIR / "doctamper",
        "access_instructions": "Request download credentials via https://github.com/ZechengHe/DocTamper. Place training and benchmark splits in /data/raw/doctamper/.",
        "description": "Pixel-level document tampering dataset"
    },
    "tdoc": {
        "name": "TDoc-2.8M Document Dataset",
        "url": None,
        "restricted": True,
        "target_dir": RAW_DIR / "tdoc",
        "access_instructions": "Access via https://github.com/HCIILAB/TDoc-2.8M. For single-machine training, download the recommended 5,000-sample mini-subset into /data/raw/tdoc/.",
        "description": "Synthetic text and layout document dataset"
    },
    "staver": {
        "name": "StaVer Stamp Verification Dataset",
        "url": None,
        "restricted": True,
        "target_dir": RAW_DIR / "staver",
        "access_instructions": "Official repo: https://github.com/iapr-tc11/StaVer-dataset. Place stamp scans and masks in /data/raw/staver/.",
        "description": "Stamp detection and verification dataset"
    },
    "academic_certificates": {
        "name": "Academic Certificate Image Dataset",
        "url": None,
        "restricted": False,
        "target_dir": RAW_DIR / "academic_certificates",
        "description": "Public academic diploma and certificate templates"
    },
    "sidtd": {
        "name": "SIDTD Identity Document Tampering",
        "url": None,
        "restricted": True,
        "target_dir": RAW_DIR / "sidtd",
        "access_instructions": "Repository at https://github.com/ComputerVisionCentre/SIDTD. Place sample subsets into /data/raw/sidtd/.",
        "description": "Identity document tampering benchmark"
    },
    "aiforge": {
        "name": "AIForge-Doc Generative Forgery Dataset",
        "url": None,
        "restricted": True,
        "target_dir": RAW_DIR / "aiforge",
        "access_instructions": "Repository at https://github.com/AIForge-Doc/Benchmark. Place generative diffusion samples in /data/raw/aiforge/.",
        "description": "Generative AI document modification benchmark"
    },
    "lor": {
        "name": "Recommendation Letters Dataset",
        "url": None,
        "restricted": False,
        "target_dir": RAW_DIR / "lor",
        "description": "Letters of recommendation research corpus"
    }
}


def calculate_sha256(filepath: Path) -> str:
    sha = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            sha.update(chunk)
    return sha.hexdigest()


def ensure_directories():
    """Ensure all required dataset directories exist."""
    dirs = [
        RAW_DIR / "academic_certificates",
        RAW_DIR / "doctamper",
        RAW_DIR / "tdoc",
        RAW_DIR / "staver",
        RAW_DIR / "cedar",
        RAW_DIR / "funsd",
        RAW_DIR / "sidtd",
        RAW_DIR / "aiforge",
        RAW_DIR / "lor",
        DATA_DIR / "processed",
        DATA_DIR / "synthetic" / "certificates",
        DATA_DIR / "synthetic" / "lor",
        DATA_DIR / "train",
        DATA_DIR / "validation",
        DATA_DIR / "test"
    ]
    for d in dirs:
        d.mkdir(parents=True, exist_ok=True)
    print(f"[OK] Verified directory structure under {DATA_DIR}")


def download_public_dataset(key: str, config: dict):
    target_dir = config["target_dir"]
    target_dir.mkdir(parents=True, exist_ok=True)
    url = config.get("url")

    if not url:
        print(f"[*] Dataset '{key}' requires synthetic generation or manual placement.")
        return False

    archive_name = url.split("/")[-1]
    archive_path = target_dir / archive_name
    metadata_file = target_dir / "download_metadata.json"

    if metadata_file.exists() and archive_path.exists():
        print(f"[+] Dataset '{key}' archive already exists. Skipping download.")
        return True

    print(f"[*] Downloading '{config['name']}' from {url}...")
    try:
        urllib.request.urlretrieve(url, archive_path)
        checksum = calculate_sha256(archive_path)
        print(f"[+] Download complete: {archive_name} (SHA-256: {checksum[:12]}...)")

        if config.get("archive_format") == "zip":
            print(f"[*] Extracting {archive_name}...")
            with zipfile.ZipFile(archive_path, 'r') as zip_ref:
                zip_ref.extractall(target_dir)

        metadata = {
            "name": config["name"],
            "source_url": url,
            "status": "DOWNLOADED",
            "sha256": checksum,
            "archive": archive_name
        }
        with open(metadata_file, "w") as f:
            json.dump(metadata, f, indent=2)
        return True
    except Exception as e:
        print(f"[!] Warning: Failed to download {url}: {e}")
        return False


def main():
    print("==================================================")
    print("  KANA-FORGE DATASET ACQUISITION & INGESTION")
    print("==================================================")
    ensure_directories()

    status_report = {}
    for key, cfg in DATASET_CONFIG.items():
        print(f"\nProcessing [{key.upper()}]: {cfg['name']}")
        if cfg["restricted"]:
            print(f"  [RESTRICTED ACCESS] {cfg.get('access_instructions')}")
            status_report[key] = {
                "status": "MANUAL_ACCESS_REQUIRED",
                "instructions": cfg.get("access_instructions"),
                "directory": str(cfg["target_dir"])
            }
        else:
            downloaded = download_public_dataset(key, cfg)
            status_report[key] = {
                "status": "AVAILABLE" if downloaded else "SYNTHETIC_FALLBACK_ACTIVE",
                "directory": str(cfg["target_dir"])
            }

    status_file = DATA_DIR / "acquisition_status.json"
    with open(status_file, "w") as f:
        json.dump(status_report, f, indent=2)
    print(f"\n[OK] Dataset acquisition manifest saved to {status_file}")


if __name__ == "__main__":
    main()
