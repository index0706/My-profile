"""
================================================================================
CHARLES RICHARD O. SITU - PERSONAL DIGITAL RESUME
Zero-Dependency Automatic Live Reload Development Server
================================================================================
Watches index.html, style.css, script.js, and assets.
When you press Ctrl+S in your editor to save any changes,
this server automatically detects the update and reloads your browser instantly!
"""

import os
import sys
import time
import queue
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Global subscriber queue list for live reload events
clients = []
clients_lock = threading.Lock()

def get_watched_files():
    """Return a dictionary of file path -> last modified time."""
    watched = {}
    extensions = ('.html', '.css', '.js', '.json', '.svg', '.png', '.jpg', '.jpeg', '.pdf')
    for root, dirs, files in os.walk(DIRECTORY):
        # Skip git or temporary folders
        if '.git' in root or '__pycache__' in root or '.system_generated' in root:
            continue
        for file in files:
            if file.lower().endswith(extensions) and file != 'dev_server.py':
                path = os.path.join(root, file)
                try:
                    watched[path] = os.path.getmtime(path)
                except OSError:
                    pass
    return watched

def file_watcher():
    """Background thread that monitors file modification timestamps."""
    last_snapshot = get_watched_files()
    while True:
        time.sleep(0.3)  # Check every 300ms
        current_snapshot = get_watched_files()
        
        changed_type = None
        # Check modified or added files
        for path, mtime in current_snapshot.items():
            if path not in last_snapshot or mtime > last_snapshot[path]:
                rel_path = os.path.relpath(path, DIRECTORY)
                print(f"[LiveReload] File saved: {rel_path} -> Auto-refreshing browser...")
                if rel_path.endswith('.css'):
                    changed_type = 'css'
                else:
                    changed_type = 'reload'
                break
        
        # Check deleted files
        if not changed_type:
            for path in last_snapshot:
                if path not in current_snapshot:
                    print(f"[LiveReload] File removed: {os.path.relpath(path, DIRECTORY)} -> Auto-refreshing...")
                    changed_type = 'reload'
                    break

        last_snapshot = current_snapshot

        if changed_type:
            # Broadcast to all connected browser tabs
            msg = f"data: {changed_type}\n\n"
            with clients_lock:
                for q in list(clients):
                    try:
                        q.put_nowait(msg)
                    except Exception:
                        pass

class LiveReloadHandler(SimpleHTTPRequestHandler):
    """HTTP Request Handler supporting static files and SSE live-reload endpoint."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and disable browser caching during development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        # SSE endpoint for live reload
        if self.path.startswith('/live-reload'):
            self.send_response(200)
            self.send_header('Content-Type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.end_headers()

            q = queue.Queue()
            with clients_lock:
                clients.append(q)

            try:
                # Send immediate connection acknowledgment
                self.wfile.write(b"data: connected\n\n")
                self.wfile.flush()

                while True:
                    try:
                        # Wait for reload event or heartbeat timeout
                        msg = q.get(timeout=20)
                        self.wfile.write(msg.encode('utf-8'))
                        self.wfile.flush()
                    except queue.Empty:
                        # Keep-alive heartbeat comment
                        self.wfile.write(b": heartbeat\n\n")
                        self.wfile.flush()
            except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError, OSError):
                pass
            finally:
                with clients_lock:
                    if q in clients:
                        clients.remove(q)
            return

        # Serve static files as usual
        return super().do_GET()

    def log_message(self, format, *args):
        # Suppress noisy GET log spam for live-reload heartbeat
        try:
            msg = format % args
            if '/live-reload' in msg:
                return
            super().log_message(format, *args)
        except Exception:
            super().log_message(format, *args)

def run():
    global PORT
    # Start file watcher in background thread
    watcher_thread = threading.Thread(target=file_watcher, daemon=True)
    watcher_thread.start()

    # Find open port if 3000 is occupied
    server = None
    for try_port in [PORT, 3001, 8000, 8080, 5000]:
        try:
            server = ThreadingHTTPServer(('0.0.0.0', try_port), LiveReloadHandler)
            PORT = try_port
            break
        except OSError:
            continue

    if not server:
        print("[Error] Could not find an open port. Please close other servers and try again.")
        sys.exit(1)

    url = f"http://localhost:{PORT}"
    print("=" * 68)
    print(" CHARLES RICHARD O. SITU - DIGITAL RESUME LIVE SERVER")
    print("=" * 68)
    print(f" > Local Server running at: {url}")
    print(" > Watching files: index.html, style.css, script.js, assets/...")
    print(" > LIVE RELOAD ACTIVE: Press Ctrl+S in your editor to see changes instantly!")
    print(" > Press Ctrl+C in this terminal to stop.")
    print("=" * 68)

    # Open browser automatically after 0.5s
    threading.Timer(0.6, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[Server stopped by user]")
        server.server_close()

if __name__ == '__main__':
    run()
