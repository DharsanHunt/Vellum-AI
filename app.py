"""
Main entry point for Kana-Forge Streamlit Application.
"""

import sys
from pathlib import Path

# Add project root to path
ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Import the Streamlit dashboard app
from frontend.app import *
