#!/usr/bin/env python3
"""
Python script to remove old favicon.ico and generate a new favicon.ico from logo_vinnavar.webp
"""

import os
from PIL import Image

webp_path = "/var/www/vinnavar-fullstack/vinnavar-frontend/public/logo_vinnavar.webp"
favicon_path = "/var/www/vinnavar-fullstack/vinnavar-frontend/public/favicon.ico"

def convert_favicon():
    # 1. Remove existing favicon.ico if present
    if os.path.exists(favicon_path):
        os.remove(favicon_path)
        print(f"[OK] Successfully removed old {favicon_path}")
    else:
        print(f"[INFO] Old favicon.ico not found at {favicon_path}")

    # 2. Open logo_vinnavar.webp and create ICO file
    if os.path.exists(webp_path):
        img = Image.open(webp_path).convert("RGBA")
        img.save(
            favicon_path,
            format="ICO",
            sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
        )
        # Save PNG variants for Java PDF invoice generation and media fallbacks
        png_targets = [
            "/var/www/vinnavar-fullstack/vinnavar-frontend/public/logo_vinnavar.png",
            "/var/www/vinnavar-fullstack/vinnavar-frontend/build/logo_vinnavar.png",
            "/var/www/vinnavar-fullstack/vinnavar-backend/media/site/logo_vinnavar.png",
            "/var/www/vinnavar-fullstack/vinnavar-backend/media/site/Grocerylogo.png",
            "/var/www/vinnavar-fullstack/vinnavar-backend/media/site/vinnavar_logo.png",
            "/var/www/vinnavar-fullstack/vinnavar-backend/media/site/logo.png"
        ]
        for target in png_targets:
            os.makedirs(os.path.dirname(target), exist_ok=True)
            img.save(target, format="PNG")
            print(f"[OK] Generated PNG at {target}")

        import shutil
        webp_targets = [
            "/var/www/vinnavar-fullstack/vinnavar-backend/media/site/logo_vinnavar.webp",
            "/var/www/vinnavar-fullstack/vinnavar-frontend/build/logo_vinnavar.webp"
        ]
        for target in webp_targets:
            if os.path.exists(os.path.dirname(target)):
                shutil.copyfile(webp_path, target)
                print(f"[OK] Copied WebP to {target}")
    else:
        print(f"[ERROR] Source image {webp_path} does not exist.")

if __name__ == "__main__":
    convert_favicon()
