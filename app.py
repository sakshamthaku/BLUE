
from flask import Flask, jsonify, render_template

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/health")
def health():
    return jsonify({
        "service": "BLUE AI",
        "company": "NICO",
        "status": "online"
    })


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
