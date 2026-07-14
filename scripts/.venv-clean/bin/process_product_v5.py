#!/usr/bin/env python3
"""
WARDEN Product Photo Processor v5
Ultra-conservative chroma key + crop-first strategy.
NO morphological dilation of background — object edges are preserved exactly.
"""

import cv2
import numpy as np
from PIL import Image
import os
from pathlib import Path

RAW = Path("/Users/brian/warden-platform/public/images/products/raw")
OUT = Path("/Users/brian/warden-platform/public/images/products/processed")
CANVAS = (2000, 2000)
FILL_FRAC = 0.75
BG_COLOR = (0xD9, 0xD9, 0xD9)  # grey


def debug_save(img, name, path):
    """Save debug image."""
    d = path.parent / "debug"
    d.mkdir(exist_ok=True)
    cv2.imwrite(str(d / name), img)


def find_crop(img_bgr, debug_path=None):
    """Find tight object crop by flood-filling connected blue background from edges."""
    h, w = img_bgr.shape[:2]
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    
    # Generous blue for background detection
    blue = ((hsv[:,:,0] >= 88) & (hsv[:,:,0] <= 118) &
            (hsv[:,:,1] >= 8))
    dark = ((hsv[:,:,0] >= 85) & (hsv[:,:,0] <= 120) &
            (hsv[:,:,1] >= 3) & (hsv[:,:,2] >= 1))
    bg = (blue | dark).astype(np.uint8) * 255
    
    # Clean mask
    k3 = np.ones((3,3), np.uint8)
    bg = cv2.morphologyEx(bg, cv2.MORPH_CLOSE, k3, iterations=2)
    
    # Flood fill from edges to capture connected background
    ff = np.zeros((h+2, w+2), np.uint8)
    step = max(1, w // 8)
    seeds = []
    for x in range(0, w, step):
        seeds.extend([(x, 0), (x, h-1)])
    for y in range(0, h, step):
        seeds.extend([(0, y), (w-1, y)])
    
    bg_ff = bg.copy()
    for sx, sy in seeds:
        if bg_ff[sy, sx] > 0:
            cv2.floodFill(bg_ff, ff, (sx, sy), 128, loDiff=(8, 50, 50), upDiff=(8, 50, 50))
    
    connected_bg = ff[1:-1, 1:-1] > 0
    # Also add saturated blue missed by flood
    sb = ((hsv[:,:,0] >= 95) & (hsv[:,:,0] <= 110) & (hsv[:,:,1] >= 80) & (hsv[:,:,2] >= 50))
    connected_bg |= sb
    
    fg = (~connected_bg).astype(np.uint8) * 255
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, k3, iterations=2)
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((5,5), np.uint8), iterations=1)
    
    # Keep largest
    n, labels, stats, _ = cv2.connectedComponentsWithStats(fg, connectivity=8)
    if n > 1:
        sizes = stats[1:, -1]
        order = np.argsort(sizes)[::-1]
        keep = np.zeros_like(fg)
        for i in order:
            if sizes[i] > sizes[order[0]] * 0.10:
                keep[labels == i + 1] = 255
        fg = keep
    
    if debug_path:
        debug_save(fg, "crop_fg.png", debug_path)
    
    ys, xs = np.where(fg > 0)
    if len(ys) < 100:
        return (0, 0, w, h)
    
    y1, y2 = int(ys.min()), int(ys.max())
    x1, x2 = int(xs.min()), int(xs.max())
    oh = y2 - y1
    ow = x2 - x1
    
    # 15% padding
    p = 0.15
    y1 = max(0, int(y1 - p * oh))
    y2 = min(h, int(y2 + p * oh))
    x1 = max(0, int(x1 - p * ow))
    x2 = min(w, int(x2 + p * ow))
    
    return (x1, y1, x2, y2)


def remove_blue_conservative(bgr_img):
    """
    Remove only PURE blue background pixels. 
    NO morphology that expands background. NO distance transform threshold.
    This preserves object edges at the cost of possibly leaving some blue fringe.
    """
    h, w = bgr_img.shape[:2]
    hsv = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2HSV)
    
    # Only catch PURE blue — very tight range
    bright_blue = ((hsv[:,:,0] >= 98) & (hsv[:,:,0] <= 108) &
                   (hsv[:,:,1] >= 80) & (hsv[:,:,2] >= 40))
    
    mid_blue = ((hsv[:,:,0] >= 96) & (hsv[:,:,0] <= 110) &
                (hsv[:,:,1] >= 40) & (hsv[:,:,2] >= 25))
    
    # Dark/shadowed blue
    dark_blue = ((hsv[:,:,0] >= 95) & (hsv[:,:,0] <= 112) &
                 (hsv[:,:,1] >= 15) & (hsv[:,:,2] >= 3) & (hsv[:,:,2] < 30))
    
    bg = (bright_blue | mid_blue | dark_blue)
    
    # NO dilation — this is what eats the object!
    # Only fill small holes in background
    k3 = np.ones((3,3), np.uint8)
    bg = cv2.morphologyEx(bg.astype(np.uint8), cv2.MORPH_CLOSE, k3, iterations=1)
    # CRITICAL: convert to 0/255 (morphology on bool-as-uint8 gives 0/1)
    bg = (bg > 0).astype(np.uint8) * 255
    
    # Foreground
    fg = (255 - bg).astype(np.uint8)
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, k3, iterations=1)
    
    # Minimal feather — just enough to avoid hard edges
    dist = cv2.distanceTransform(fg, cv2.DIST_L2, 3)
    dist = np.clip(dist, 0, 255).astype(np.uint8)
    # Very low threshold to preserve object edge
    _, alpha = cv2.threshold(dist, 2, 255, cv2.THRESH_BINARY)
    alpha = cv2.GaussianBlur(alpha, (3, 3), 1)
    
    # Result: original image, transparent only where definitely blue
    result = bgr_img.copy()
    result[alpha < 3] = 0
    
    return alpha, result


def process_one(input_path, output_path):
    name = os.path.basename(input_path)
    print(f"\n{'='*55}")
    print(f"📷 {name}")
    
    img = cv2.imread(str(input_path))
    if img is None:
        print("   ❌ Cannot read"); return False
    
    print(f"   Original: {img.shape[1]}x{img.shape[0]}")
    
    # Step 1: Crop
    print(f"   ✂️ Cropping...")
    x1, y1, x2, y2 = find_crop(img, debug_path=output_path.parent)
    cropped = img[y1:y2, x1:x2].copy()
    print(f"   Crop: {x2-x1}x{y2-y1}")
    
    # Step 2: Ultra-conservative chroma key
    print(f"   🎨 Removing blue...")
    alpha, fg = remove_blue_conservative(cropped)
    pct_obj = np.mean(alpha > 40) * 100
    print(f"   Object: {pct_obj:.1f}% of crop")
    if pct_obj < 10:
        print(f"   ⚠️ Very small object! Trying looser range...")
        # Fallback: wider range
        hsv = cv2.cvtColor(cropped, cv2.COLOR_BGR2HSV)
        bg = ((hsv[:,:,0] >= 92) & (hsv[:,:,0] <= 115) &
              (hsv[:,:,1] >= 15) & (hsv[:,:,2] >= 5))
        bg = cv2.morphologyEx(bg.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3,3), np.uint8), iterations=1)
        bg = (bg > 0).astype(np.uint8) * 255
        fg2 = (255 - bg).astype(np.uint8)
        dist = cv2.distanceTransform(fg2, cv2.DIST_L2, 3)
        dist = np.clip(dist, 0, 255).astype(np.uint8)
        _, alpha = cv2.threshold(dist, 3, 255, cv2.THRESH_BINARY)
        alpha = cv2.GaussianBlur(alpha, (3, 3), 1)
        fg = cropped.copy()
        fg[alpha < 3] = 0
    
    # Step 3: Scale to canvas
    print(f"   📐 Scaling...")
    cw, ch = CANVAS
    oh, ow = fg.shape[:2]
    
    scale = (ch * FILL_FRAC) / oh
    nw = int(ow * scale)
    nh = int(oh * scale)
    
    if nw > cw * 0.92:
        scale = (cw * 0.92) / ow
        nw = int(ow * scale)
        nh = int(oh * scale)
    if nw > cw:
        scale = cw / ow; nw = int(ow * scale); nh = int(oh * scale)
    if nh > ch:
        scale = ch / oh; nw = int(ow * scale); nh = int(oh * scale)
    
    nw, nh = max(nw, 50), max(nh, 50)
    
    obj = cv2.resize(fg, (nw, nh), interpolation=cv2.INTER_LANCZOS4)
    obj_a = cv2.resize(alpha, (nw, nh), interpolation=cv2.INTER_LANCZOS4)
    x_off = (cw - nw) // 2
    y_off = (ch - nh) // 2
    print(f"   Placed: {nw}x{nh} at ({x_off},{y_off})")
    
    # Step 4: Shadow
    _, sh_bin = cv2.threshold(obj_a, 30, 255, cv2.THRESH_BINARY)
    sh_bin = cv2.dilate(sh_bin, np.ones((12,12), np.uint8), iterations=1)
    
    ox, oy = (40, 40)
    sh = np.zeros_like(sh_bin, dtype=np.float32)
    if oy < nh and ox < nw:
        sh[oy:, ox:] = sh_bin[:nh-oy, :nw-ox].astype(np.float32)
    
    shadow = cv2.GaussianBlur(sh, (0, 0), 30)
    if shadow.max() > 0:
        shadow = shadow / shadow.max() * 0.40
    
    # Step 5: Composite
    bg = np.full((ch, cw, 3), BG_COLOR[::-1], dtype=np.uint8)
    
    # Shadow
    sr = shadow > 0.005
    if np.any(sr):
        sy1 = max(0, y_off); sy2 = min(ch, y_off + shadow.shape[0])
        sx1 = max(0, x_off); sx2 = min(cw, x_off + shadow.shape[1])
        sa = shadow[:sy2-sy1, :sx2-sx1]
        for c in range(3):
            bg[sy1:sy2, sx1:sx2, c] = np.clip(
                bg[sy1:sy2, sx1:sx2, c].astype(np.float32) * (1 - sa * 0.55),
                0, 255).astype(np.uint8)
    
    # Object
    an = obj_a.astype(np.float32) / 255.0
    roi = bg[y_off:y_off+nh, x_off:x_off+nw]
    for c in range(3):
        roi[:,:,c] = (obj[:,:,c].astype(np.float32) * an +
                      roi[:,:,c].astype(np.float32) * (1 - an)).astype(np.uint8)
    bg[y_off:y_off+nh, x_off:x_off+nw] = roi
    
    # Save
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    Image.fromarray(cv2.cvtColor(bg, cv2.COLOR_BGR2RGB)).save(
        output_path, quality=95, subsampling=0)
    
    # Also save crop debug
    crop_debug = str(output_path).replace("_product.jpg", "_crop.jpg")
    cv2.imwrite(crop_debug, cropped)
    
    print(f"   ✅ {os.path.basename(output_path)}  ({os.path.getsize(output_path)//1024} KB)")
    return True


def main():
    images = sorted(RAW.glob("IMG_*.jpeg"))
    print(f"📸 {len(images)} images\n")
    for p in images:
        out = OUT / f"{p.stem}_product.jpg"
        process_one(p, out)
    print(f"\n✅ Done → {OUT}")


if __name__ == "__main__":
    main()
