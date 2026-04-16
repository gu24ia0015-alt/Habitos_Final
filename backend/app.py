from flask import Flask, jsonify, request
from flask_cors import CORS
from database import init_db, get_connection

app = Flask(__name__)
CORS(app)

init_db()

@app.route('/api/habits', methods=['GET'])
def get_habits():
    conn = get_connection()
    habits = conn.execute('SELECT * FROM habits ORDER BY created_at DESC').fetchall()
    conn.close()
    return jsonify([dict(h) for h in habits])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)