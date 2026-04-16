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



@app.route('/api/habits', methods=['POST'])
def create_habit():
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400

    conn = get_connection()
    cursor = conn.execute(
        'INSERT INTO habits (name, description, color) VALUES (?, ?, ?)',
        (data['name'], data.get('description', ''), data.get('color', '#6366f1'))
    )
    conn.commit()
    habit = conn.execute('SELECT * FROM habits WHERE id = ?', (cursor.lastrowid,)).fetchone()
    conn.close()
    return jsonify(dict(habit)), 201

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)