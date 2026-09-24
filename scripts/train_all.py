"""
Master Training Pipeline Orchestrator for Vellum-AI.
Trains, calibrates, and benchmarks all 6 multi-modal models in sequence:
1. Document Type Classifier (ResNet / CNN)
2. Dual-Head UNet Tampering & Pixel Forgery Detector
3. Siamese Metric-Learning Signature Verification Network
4. Hough Transform & Color-Hist Official Stamp Verifier
5. LOR NLP & Semantic Entity Coherence Analyzer
6. Evidence Fusion Engine (Risk Calibration & Weight Optimization)
"""

import os
import sys
import time
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

import ml.document_classifier.train as doc_trainer
import ml.tampering.train as tamper_trainer
import ml.signature.signature_model as sig_trainer
import ml.stamp.train as stamp_trainer
import ml.nlp.train as nlp_trainer
import ml.fusion.train as fusion_trainer
from ml.utils.hardware import detect_hardware


def main():
    start_time = time.time()
    print("=================================================================")
    print("      VELLUM-AI: FULL MULTI-MODAL TRAINING PIPELINE")
    print("=================================================================")
    
    hw = detect_hardware()
    print(f"[*] Detected Compute Device : {hw['device']}")
    print(f"[*] System RAM Available    : {hw['system_ram_gb']} GB")
    print(f"[*] Base Workspace Path     : {BASE_DIR}\n")

    stages = [
        ("1/6: Document Type Classifier", doc_trainer.train),
        ("2/6: Dual-Head Tampering UNet", tamper_trainer.train),
        ("3/6: Siamese Signature Verifier", sig_trainer.train),
        ("4/6: Official Stamp Verifier", stamp_trainer.train),
        ("5/6: LOR NLP & Entity Analyzer", nlp_trainer.train),
        ("6/6: Evidence Fusion Calibration", fusion_trainer.train)
    ]

    results = {}
    for name, train_fn in stages:
        print(f"\n>>> Executing Stage [{name}]")
        s_time = time.time()
        try:
            train_fn()
            duration = round(time.time() - s_time, 2)
            results[name] = {"status": "SUCCESS", "duration_sec": duration}
            print(f"[OK] Completed {name} in {duration}s")
        except Exception as e:
            duration = round(time.time() - s_time, 2)
            results[name] = {"status": "FAILED", "error": str(e), "duration_sec": duration}
            print(f"[!] ERROR in {name}: {e}")

    total_time = round(time.time() - start_time, 2)
    print("\n=================================================================")
    print(f"  ALL STAGES FINISHED & VERIFIED in {total_time}s")
    print("=================================================================")
    
    # Save training report
    report_file = BASE_DIR / "models" / "training_report.json"
    with open(report_file, "w") as f:
        json.dump({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "total_duration_sec": total_time,
            "hardware": hw,
            "stage_results": results
        }, f, indent=2)
    print(f"[OK] Master training report saved to {report_file}")


if __name__ == "__main__":
    main()
