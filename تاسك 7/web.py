from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

@app.route("/")
def map_page():
    return render_template("map.html")

@app.route("/planes")
def get_planes():
    try:
        with open("planes.json", "r") as f:
            planes = json.load(f)
    except:
        planes = {}

    # حذف الطائرات التي سرعتها = 0
    filtered_planes = {
        tid: data for tid, data in planes.items()
        if data.get("speed", 0) > 0
    }

    return jsonify(filtered_planes)

app.run(host="0.0.0.0", port=8000, debug=True)
