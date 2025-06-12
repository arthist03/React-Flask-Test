from flask import Flask, request, jsonify

app = Flask(__name__)
# No CORS needed since Vite proxy handles this

# Simple in-memory storage for demo
tasks = [
    {"id": 1, "title": "Learn Flask", "completed": False},
    {"id": 2, "title": "Learn React", "completed": False}
]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy", "message": "Flask backend is running!"})

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    return jsonify({"tasks": tasks})

@app.route('/api/tasks', methods=['POST'])
def add_task():
    """Add a new task"""
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({"error": "Title is required"}), 400
    
    new_task = {
        "id": len(tasks) + 1,
        "title": data['title'],
        "completed": False
    }
    tasks.append(new_task)
    
    return jsonify({"message": "Task added successfully", "task": new_task}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)