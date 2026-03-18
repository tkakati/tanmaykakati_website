#!/usr/bin/env python3
"""Crop hero portrait to centered square: hat, face, shoulders, upper torso.
Output: hero-portrait-square.jpg at 1200x1200. Run from portfolio dir.
Requires: pip install Pillow
"""
try:
    from PIL import Image
except ImportError:
    raise SystemExit("Install Pillow: pip install Pillow")

path = "hero-portrait.png"
img = Image.open(path).convert("RGB")
w, h = img.size
size = min(w, h)
# Top-aligned square to keep hat/face/shoulders
left = (w - size) // 2
top = 0
box = (left, top, left + size, top + size)
cropped = img.crop(box)
out = cropped.resize((1200, 1200), Image.Resampling.LANCZOS)
out.save("hero-portrait-square.jpg", "JPEG", quality=90)
print("Saved hero-portrait-square.jpg (1200×1200)")
