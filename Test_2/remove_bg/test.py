# Tasrif Nur Himel

import io
import os
from flask import Flask, request, send_file, send_from_directory, jsonify, abort
from PIL import Image
import rembg

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 20 * 1024 * 1024  # 20MB limit

HERE = os.path.dirname(os.path.abspath(__file__))

@app.get("/")
def index():
    return send_from_directory(HERE, "index.html")

@app.get("/style.css")
def style():
    return send_from_directory(HERE, "style.css", mimetype="text/css")

@app.get("/app.js")
def script():
    return send_from_directory(HERE, "app.js", mimetype="text/javascript")


# --- API: remove background ---
@app.post("/remove")
def remove_bg():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    f = request.files["file"]
    if not f.filename:
        return jsonify({"error": "Empty filename"}), 400

    # optional: white or transparent background
    # if query param bg=transparent we keep alpha; otherwise we return white background
    bg_mode = request.args.get("bg", "white").lower()  # "white" | "transparent"

    try:
        raw = f.read()
        if bg_mode == "transparent":
            out_bytes = rembg.remove(raw)  # keeps alpha
            out = Image.open(io.BytesIO(out_bytes)).convert("RGBA")
        else:
            # white background
            out_bytes = rembg.remove(raw, bgcolor=(255, 255, 255, 255))
            out = Image.open(io.BytesIO(out_bytes)).convert("RGB")  # RGB since it's white

        # stream back as PNG
        buf = io.BytesIO()
        out.save(buf, format="PNG")
        buf.seek(0)
        return send_file(
            buf,
            mimetype="image/png",
            as_attachment=False,
            download_name="bg_removed.png",
            max_age=0,
        )
    except Exception as e:
        print("ERROR:", e)
        abort(500, description="Processing failed")

if __name__ == "__main__":
    # Run on a port that won't collide with your Next app (3000)
    app.run(host="127.0.0.1", port=5001, debug=True)
