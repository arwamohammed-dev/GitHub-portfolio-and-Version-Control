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
    return jsonify(planes)

app.run(host="0.0.0.0", port=8000, debug=True)

