#!/usr/bin/env python3
"""Local static server that also writes CMS backups to the project data/ folder."""
from __future__ import annotations

import json
import os
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, unquote, urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT, "data")
UPLOAD_DIR = os.path.join(ROOT, "images", "uploads")
SAFE_NAME = re.compile(r"[^A-Za-z0-9._-]+")


def load_json(path, default):
    if not os.path.exists(path):
        return default
    try:
        with open(path, "r", encoding="utf-8") as handle:
            return json.load(handle)
    except Exception:
        return default


def write_json_and_js(name, payload):
    os.makedirs(DATA_DIR, exist_ok=True)
    text = json.dumps(payload, ensure_ascii=False)
    with open(os.path.join(DATA_DIR, name + ".json"), "w", encoding="utf-8") as handle:
        handle.write(text)
    global_name = "GROSPER_CMS_FILE" if name == "cms" else "GROSPER_INBOX"
    with open(os.path.join(DATA_DIR, name + ".js"), "w", encoding="utf-8") as handle:
        handle.write("window.%s = " % global_name)
        handle.write(text)
        handle.write(";\n")


def merge_records(old, new, removed):
    removed = set(removed or [])
    mapped = {}
    for item in (old or []) + (new or []):
        item_id = (item or {}).get("id")
        if not item_id or item_id in removed:
            continue
        mapped[item_id] = item
    return list(mapped.values())


def merge_inbound(base, incoming, removed_jobs=None, removed_subs=None):
    base["jobs"] = merge_records(base.get("jobs"), incoming.get("jobs"), removed_jobs)
    base["subscribers"] = merge_records(
        base.get("subscribers"), incoming.get("subscribers"), removed_subs
    )
    return base


def safe_filename(name: str) -> str:
    name = os.path.basename(unquote(name or ""))
    name = SAFE_NAME.sub("-", name).strip(".-")
    return name or "file.bin"


class CmsHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length) if length else b""

        if parsed.path in ("/__cms-backup", "/__cms-backup/"):
            incoming = json.loads(body.decode("utf-8"))
            existing = load_json(os.path.join(DATA_DIR, "cms.json"), {})
            inbox = load_json(
                os.path.join(DATA_DIR, "inbox.json"),
                {"jobs": [], "subscribers": [], "removedJobs": [], "removedSubscribers": []},
            )
            removed_jobs = list(set((inbox.get("removedJobs") or []) + (incoming.get("removeJobs") or [])))
            removed_subs = list(
                set((inbox.get("removedSubscribers") or []) + (incoming.get("removeSubscribers") or []))
            )
            merge_inbound(incoming, existing, removed_jobs, removed_subs)
            merge_inbound(incoming, inbox, removed_jobs, removed_subs)
            write_json_and_js("cms", incoming)
            write_json_and_js(
                "inbox",
                {
                    "jobs": incoming.get("jobs") or [],
                    "subscribers": incoming.get("subscribers") or [],
                    "removedJobs": removed_jobs,
                    "removedSubscribers": removed_subs,
                },
            )
            self._ok(b'{"ok":true,"target":"data/cms.js"}')
            return

        if parsed.path in ("/__cms-inbox", "/__cms-inbox/"):
            incoming = json.loads(body.decode("utf-8") or "{}")
            inbox = load_json(
                os.path.join(DATA_DIR, "inbox.json"),
                {"jobs": [], "subscribers": [], "removedJobs": [], "removedSubscribers": []},
            )
            cms = load_json(os.path.join(DATA_DIR, "cms.json"), {})
            removed_jobs = list(set((inbox.get("removedJobs") or []) + (incoming.get("removeJobs") or [])))
            removed_subs = list(
                set((inbox.get("removedSubscribers") or []) + (incoming.get("removeSubscribers") or []))
            )
            merge_inbound(inbox, incoming, removed_jobs, removed_subs)
            inbox["removedJobs"] = removed_jobs
            inbox["removedSubscribers"] = removed_subs
            merge_inbound(cms, inbox, removed_jobs, removed_subs)
            write_json_and_js("inbox", inbox)
            if cms:
                write_json_and_js("cms", cms)
            self._ok(b'{"ok":true,"target":"data/inbox.js"}')
            return

        if parsed.path in ("/__cms-file", "/__cms-file/"):
            query = parse_qs(parsed.query)
            name = safe_filename((query.get("name") or ["file.bin"])[0])
            os.makedirs(UPLOAD_DIR, exist_ok=True)
            path = os.path.join(UPLOAD_DIR, name)
            with open(path, "wb") as handle:
                handle.write(body)
            rel = "images/uploads/" + name
            self._ok(('{"ok":true,"path":"%s"}' % rel).encode("utf-8"))
            return

        self.send_error(404, "Unknown backup endpoint")

    def _ok(self, payload: bytes):
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, fmt, *args):
        if str(args[0]).startswith("POST /__cms"):
            super().log_message(fmt, *args)


def main():
    port = int(os.environ.get("PORT", "5500"))
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", port), CmsHandler)
    print("Grosper local+yedek sunucu: http://127.0.0.1:%s/" % port)
    print("Yedek klasoru: %s" % DATA_DIR)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nDurduruldu.")


if __name__ == "__main__":
    main()
