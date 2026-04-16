from flask import Flask, jsonify, request
from flask_cors import CORS
from database import init_db, get_connection
from datetime import datetime, timedelta

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



@app.route('/api/habits/<int:habit_id>', methods=['DELETE'])
def delete_habit(habit_id):
    conn = get_connection()
    conn.execute('DELETE FROM habits WHERE id = ?', (habit_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Habit deleted'})

@app.route('/api/completions', methods=['GET'])
def get_completions():
    conn = get_connection()
    completions = conn.execute('SELECT * FROM completions').fetchall()
    conn.close()
    return jsonify([dict(c) for c in completions])


@app.route('/api/completions/toggle', methods=['POST'])
def toggle_completion():
    data = request.get_json()
    habit_id = data.get('habit_id')
    date = data.get('date')

    if not habit_id or not date:
        return jsonify({'error': 'habit_id and date are required'}), 400

    conn = get_connection()
    existing = conn.execute(
        'SELECT id FROM completions WHERE habit_id = ? AND completed_date = ?',
        (habit_id, date)
    ).fetchone()

    if existing:
        conn.execute('DELETE FROM completions WHERE id = ?', (existing['id'],))
        conn.commit()
        conn.close()
        return jsonify({'status': 'removed'})
    else:
        conn.execute(
            'INSERT INTO completions (habit_id, completed_date) VALUES (?, ?)',
            (habit_id, date)
        )
        conn.commit()
        conn.close()
        return jsonify({'status': 'added'})
    
    

@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_connection()
    habits = conn.execute('SELECT * FROM habits').fetchall()
    stats = []

    for habit in habits:
        total = conn.execute(
            'SELECT COUNT(*) as count FROM completions WHERE habit_id = ?',
            (habit['id'],)
        ).fetchone()['count']

        streak = 0
        check_date = datetime.today().date()
        while True:
            exists = conn.execute(
                'SELECT id FROM completions WHERE habit_id = ? AND completed_date = ?',
                (habit['id'], str(check_date))
            ).fetchone()
            if exists:
                streak += 1
                check_date -= timedelta(days=1)
            else:
                break

        last7 = []
        for i in range(6, -1, -1):
            d = datetime.today().date() - timedelta(days=i)
            done = conn.execute(
                'SELECT id FROM completions WHERE habit_id = ? AND completed_date = ?',
                (habit['id'], str(d))
            ).fetchone()
            last7.append({'date': str(d), 'completed': done is not None})

        stats.append({
            'habit_id': habit['id'],
            'name': habit['name'],
            'color': habit['color'],
            'total_completions': total,
            'current_streak': streak,
            'last_7_days': last7
        })

    conn.close()
    return jsonify(stats)





if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)