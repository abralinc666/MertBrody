"""Vercel: GET /api/matches"""
from http.server import BaseHTTPRequestHandler

from iddaa import dumps, get_matches


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            body = dumps(get_matches()).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "public, max-age=15")
        except Exception:
            body = b'{"error":"Program alinamadi"}'
            self.send_response(502)
            self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
