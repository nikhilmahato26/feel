#!/usr/bin/env python3
"""
Drive tools/crop_logos.html with headless Chrome and write the trimmed client
tiles back into public/clients/colour/, printing the background colour of each
so it can be pasted into ClientOrbit's CLIENTS array.

Needs the dev server (or any static server) on the port below.
Usage:  python3 tools/crop_logos.py [port]
"""
import base64
import html
import os
import re
import subprocess
import sys

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "clients", "colour")


def main():
    port = sys.argv[1] if len(sys.argv) > 1 else "8020"
    base = sys.argv[2] if len(sys.argv) > 2 else "/public/clients/colour"
    url = f"http://127.0.0.1:{port}/tools/crop_logos.html?base={base}"
    dom = subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--virtual-time-budget=45000",
         "--dump-dom", url],
        capture_output=True, text=True, timeout=300,
    ).stdout

    blocks = re.findall(
        r'<pre data-slug="([^"]+)" data-bg="([^"]+)" data-size="([^"]+)">([^<]+)</pre>', dom)
    if not blocks:
        print("no crops found — is the server running and the page reachable?")
        sys.exit(1)

    print(f"{'slug':<16} {'size':<12} background")
    for slug, bg, size, payload in blocks:
        raw = base64.b64decode(html.unescape(payload).split(",", 1)[1])
        with open(os.path.join(OUT, f"{slug}.png"), "wb") as f:
            f.write(raw)
        print(f"{slug:<16} {size:<12} {bg}   {len(raw) // 1024}KB")


if __name__ == "__main__":
    main()
