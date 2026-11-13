"""Yerel site + iddaa programı. Çalıştır: py server.py"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "api"))
from iddaa import dumps, get_matches  # noqa: E402

TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".json": "application/json; charset=utf-8",
    ".ico": "image/x-icon",
}


class App(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path == "/api/matches":
            try:
                body = dumps(get_matches()).encode("utf-8")
                self.send_response(200)
            except Exception as exc:
                body = ('{"error":"%s"}' % str(exc).replace('"', "'")).encode("utf-8")
                self.send_response(502)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def guess_type(self, path):
        ext = Path(path).suffix.lower()
        return TYPES.get(ext, super().guess_type(path))


if __name__ == "__main__":
    port = 4173
    ThreadingHTTPServer(("127.0.0.1", port), App).serve_forever()
