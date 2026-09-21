"""
Compute-Aware Hardware Detection & Resource Estimator.
Inspects CPU, GPU, memory, and optimizes training batch sizes and model architectures
without external psutil dependency.
"""

import os
import sys
import platform
import torch
from typing import Dict, Any


def get_total_ram_gb() -> float:
    """Gets total RAM in GB using standard library."""
    try:
        if platform.system() == "Windows":
            import ctypes
            class MEMORYSTATUSEX(ctypes.Structure):
                _fields_ = [
                    ("dwLength", ctypes.c_ulong),
                    ("dwMemoryLoad", ctypes.c_ulong),
                    ("ullTotalPhys", ctypes.c_ulonglong),
                    ("ullAvailPhys", ctypes.c_ulonglong),
                    ("ullTotalPageFile", ctypes.c_ulonglong),
                    ("ullAvailPageFile", ctypes.c_ulonglong),
                    ("ullTotalVirtual", ctypes.c_ulonglong),
                    ("ullAvailVirtual", ctypes.c_ulonglong),
                    ("sullAvailExtendedVirtual", ctypes.c_ulonglong),
                ]
            stat = MEMORYSTATUSEX()
            stat.dwLength = ctypes.sizeof(MEMORYSTATUSEX)
            ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat))
            return round(stat.ullTotalPhys / (1024 ** 3), 2)
        else:
            # Unix / Linux
            mem_bytes = os.sysconf('SC_PAGE_SIZE') * os.sysconf('SC_PHYS_PAGES')
            return round(mem_bytes / (1024 ** 3), 2)
    except Exception:
        return 16.0


def detect_hardware() -> Dict[str, Any]:
    """
    Detects system compute hardware capabilities (CUDA, CPU cores, RAM).
    """
    has_cuda = torch.cuda.is_available()
    device_name = "cuda" if has_cuda else "cpu"
    
    cpu_count = os.cpu_count() or 1
    ram_gb = get_total_ram_gb()
    
    gpu_info = {}
    if has_cuda:
        gpu_info = {
            "device_name": torch.cuda.get_device_name(0),
            "device_count": torch.cuda.device_count(),
            "vram_gb": round(torch.cuda.get_device_properties(0).total_memory / (1024 ** 3), 2)
        }
    
    return {
        "device": device_name,
        "is_cuda_available": has_cuda,
        "cpu_cores": cpu_count,
        "system_ram_gb": ram_gb,
        "gpu": gpu_info,
        "recommended_batch_size": 16 if has_cuda else 4,
        "recommended_image_size": (256, 256) if not has_cuda else (512, 512),
        "precision": "float32"
    }


def estimate_training_resources(num_samples: int, num_epochs: int, model_type: str = "cnn") -> Dict[str, Any]:
    hw = detect_hardware()
    is_cpu = not hw["is_cuda_available"]
    
    sec_per_sample = 0.04 if not is_cpu else 0.10
    if model_type == "unet":
        sec_per_sample *= 1.5
    elif model_type == "siamese":
        sec_per_sample *= 0.6
        
    est_total_seconds = num_samples * num_epochs * sec_per_sample
    est_duration_minutes = round(est_total_seconds / 60.0, 2)
    est_memory_mb = 120 if is_cpu else 450
    est_checkpoint_mb = 15
    
    return {
        "dataset_samples": num_samples,
        "epochs": num_epochs,
        "hardware_mode": "CPU (Optimized Lightweight Mode)" if is_cpu else "GPU (CUDA Accelerated)",
        "estimated_duration_min": est_duration_minutes,
        "estimated_ram_mb": est_memory_mb,
        "estimated_checkpoint_disk_mb": est_checkpoint_mb
    }


if __name__ == "__main__":
    import json
    print("Detected Hardware:")
    print(json.dumps(detect_hardware(), indent=2))
