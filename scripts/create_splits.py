"""
Dataset Stratified Split Generation Script.
Splits processed datasets into 70% Train, 15% Validation, and 15% Test splits
preserving balanced distributions of tampering and anomaly types.
"""

import os
import json
import random
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
PROCESSED_FILE = DATA_DIR / "processed" / "dataset_master_index.json"

TRAIN_DIR = DATA_DIR / "train"
VAL_DIR = DATA_DIR / "validation"
TEST_DIR = DATA_DIR / "test"

TRAIN_DIR.mkdir(parents=True, exist_ok=True)
VAL_DIR.mkdir(parents=True, exist_ok=True)
TEST_DIR.mkdir(parents=True, exist_ok=True)


def stratify_split(items: list, key_fn, train_ratio=0.70, val_ratio=0.15, seed=42):
    random.seed(seed)
    grouped = defaultdict(list)
    for item in items:
        grouped[key_fn(item)].append(item)

    train, val, test = [], [], []
    for k, group in grouped.items():
        random.shuffle(group)
        n = len(group)
        n_train = max(1, int(n * train_ratio))
        n_val = max(1, int(n * val_ratio)) if n > 2 else 0
        
        train.extend(group[:n_train])
        val.extend(group[n_train:n_train + n_val])
        test.extend(group[n_train + n_val:])

    return train, val, test


def main():
    print("==================================================")
    print("  KANA-FORGE DATASET STRATIFIED SPLITS CREATOR")
    print("==================================================")

    if not PROCESSED_FILE.exists():
        print("[-] Processed dataset index not found. Run prepare_datasets.py first.")
        return

    with open(PROCESSED_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    certs = data.get("certificates", [])
    lors = data.get("lors", [])

    print(f"[*] Splitting {len(certs)} certificates and {len(lors)} LORs...")

    # Stratify certificates by tampering_type
    cert_train, cert_val, cert_test = stratify_split(
        certs, key_fn=lambda x: x.get("tampering_type", "clean")
    )

    # Stratify LORs by issue
    lor_train, lor_val, lor_test = stratify_split(
        lors, key_fn=lambda x: x.get("issue", "valid")
    )

    splits = {
        "train": {
            "dir": TRAIN_DIR,
            "certificates": cert_train,
            "lors": lor_train
        },
        "validation": {
            "dir": VAL_DIR,
            "certificates": cert_val,
            "lors": lor_val
        },
        "test": {
            "dir": TEST_DIR,
            "certificates": cert_test,
            "lors": lor_test
        }
    }

    for split_name, sdata in splits.items():
        manifest = {
            "split": split_name,
            "total_certificates": len(sdata["certificates"]),
            "total_lors": len(sdata["lors"]),
            "certificates": sdata["certificates"],
            "lors": sdata["lors"]
        }
        out_path = sdata["dir"] / "index.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2)
        print(f"[OK] {split_name.capitalize()} split created: {len(sdata['certificates'])} certs, {len(sdata['lors'])} lors -> {out_path}")

    print("\n[OK] All dataset splits successfully generated.")


if __name__ == "__main__":
    main()
