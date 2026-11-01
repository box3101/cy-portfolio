"""Render first pages of public PDFs to local WebP previews.

Usage: python scripts/generate-archive-previews.py artifacts/journal/archive-sources.json
Input: {"url": "https://<project>.supabase.co", "docs": [{"file_path": "..."}]}
Dependencies: PyMuPDF==1.26.7, Pillow==12.0.0 (local cache or environment).
"""
import hashlib
import io
import json
from pathlib import Path
import sys
from urllib.parse import quote
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'node_modules/.cache/pdf-preview-python'))
import pymupdf
from PIL import Image

source = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8-sig'))
output = ROOT / 'public/images/archive'
output.mkdir(parents=True, exist_ok=True)
manifest_path = ROOT / 'data/archivePreviews.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8')) if manifest_path.exists() else {}
failures = []
for item in source['docs']:
    path = item['file_path']
    try:
        url = source['url'].rstrip('/') + '/storage/v1/object/public/documents/' + quote(path, safe='/')
        with urlopen(url, timeout=45) as response:
            data = response.read()
        with pymupdf.open(stream=data, filetype='pdf') as pdf:
            page = pdf[0]
            scale = min(900 / page.rect.width, 1200 / page.rect.height)
            pixmap = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), alpha=False)
            preview = Image.open(io.BytesIO(pixmap.tobytes('png'))).convert('RGB')
            name = hashlib.sha256(data).hexdigest()[:16] + '.webp'
            preview.save(output / name, 'WEBP', quality=90, method=6)
            manifest[path] = {'src': '/images/archive/' + name, 'pages': len(pdf)}
            print('Rendered', path, len(pdf), 'pages', flush=True)
    except Exception as error:
        failures.append(path)
        print('Failed', path, str(error), flush=True)
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Previews:', len(manifest), 'Failures:', len(failures), flush=True)
if failures:
    sys.exit(1)
