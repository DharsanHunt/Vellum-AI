"""
Evaluation Metrics Utilities for Classification, Segmentation, and Metric Learning.
"""

import numpy as np
from typing import Dict, List, Any
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)


def compute_classification_metrics(y_true: List[int], y_pred: List[int], y_prob: List[float] = None) -> Dict[str, float]:
    """
    Computes standard classification metrics with proper multi-class and binary support.
    """
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    unique_classes = np.unique(y_true)

    acc = float(accuracy_score(y_true, y_pred))

    if len(unique_classes) == 1:
        prec = float(accuracy_score(y_true, y_pred))
        rec = prec
        f1 = prec
    elif len(unique_classes) == 2:
        prec = float(precision_score(y_true, y_pred, pos_label=1, zero_division=0))
        rec = float(recall_score(y_true, y_pred, pos_label=1, zero_division=0))
        f1 = float(f1_score(y_true, y_pred, pos_label=1, zero_division=0))
    else:
        prec = float(precision_score(y_true, y_pred, average="macro", zero_division=0))
        rec = float(recall_score(y_true, y_pred, average="macro", zero_division=0))
        f1 = float(f1_score(y_true, y_pred, average="macro", zero_division=0))

    metrics = {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1": round(f1, 4)
    }

    if y_prob is not None and len(unique_classes) == 2:
        try:
            auc = float(roc_auc_score(y_true, y_prob))
            metrics["roc_auc"] = round(auc, 4)
        except Exception:
            metrics["roc_auc"] = 0.0

    return metrics


def compute_segmentation_iou(pred_masks: np.ndarray, true_masks: np.ndarray, threshold: float = 0.35) -> float:
    pred_bin = (pred_masks > threshold).astype(bool)
    true_bin = (true_masks > threshold).astype(bool)

    intersection = np.logical_and(pred_bin, true_bin).sum()
    union = np.logical_or(pred_bin, true_bin).sum()

    if union == 0:
        return 1.0 if intersection == 0 else 0.0

    return round(float(intersection / union), 4)


def compute_dice_coefficient(pred_masks: np.ndarray, true_masks: np.ndarray, threshold: float = 0.35) -> float:
    pred_bin = (pred_masks > threshold).astype(bool)
    true_bin = (true_masks > threshold).astype(bool)

    intersection = np.logical_and(pred_bin, true_bin).sum()
    total = pred_bin.sum() + true_bin.sum()

    if total == 0:
        return 1.0

    return round(float((2.0 * intersection) / total), 4)
