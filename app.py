import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, send_from_directory
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()

app = Flask(__name__, template_folder='templates', static_folder='templates')

# CONNEXION À LA BASE ---
#def get_db_connection():
 #   return psycopg2.connect(
  #      host="localhost",
   #     database="taches",
    #    user="postgres",
     #   password="ton_password"
    #)
# version sécurisée
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS')
    )

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/script.js')
def serve_js():
    return send_from_directory('templates', 'script.js')

# --- API DE LIAISON ---

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    # On sélectionne les colonnes SQL en leur donnant les noms attendus par le JS (titre -> text, fait -> completed)
    cur.execute('''
        SELECT id, titre as text, date_limite as date, categorie as category, 
               recurrence, fait as completed, important, cree_le 
        FROM tasks;
    ''')
    tasks = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    task = request.json
    if task:
        conn = get_db_connection()
        cur = conn.cursor()
        # On utilise les noms de ta base : titre, date_limite, categorie, fait
        cur.execute('''
            INSERT INTO tasks (titre, date_limite, categorie, recurrence, fait, important)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (task['text'], task['date'] if task['date'] else None, task['category'], 
              task['recurrence'], task['completed'], task['important']))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"status": "success"}), 201
    return jsonify({"status": "error"}), 400

@app.route('/api/tasks/update', methods=['POST'])
def update_tasks():
    new_tasks = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM tasks;') 
    for t in new_tasks:
        cur.execute('''
            INSERT INTO tasks (titre, date_limite, categorie, recurrence, fait, important)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (t['text'], t['date'] if t['date'] else None, t['category'], 
              t['recurrence'], t['completed'], t['important']))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"status": "updated"})

if __name__ == '__main__':
    app.run(debug=True)