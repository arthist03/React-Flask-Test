import React, { useState, useEffect } from 'react'
import './App.css'

// With Vite proxy, we can use relative URLs
const API_BASE_URL = '/api'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [status, setStatus] = useState({ message: '', type: '' })
  const [loading, setLoading] = useState(true)

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth()
    fetchTasks()
  }, [])

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      const data = await response.json()
      setStatus({ message: data.message, type: 'success' })
    } catch (error) {
      console.error(error);
      setStatus({ 
        message: 'Failed to connect to backend. Make sure Flask server is running on port 5000.', 
        type: 'error' 
        
      })
    }
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/tasks`)
      const data = await response.json()
      setTasks(data.tasks)
      setLoading(false)
    } catch (error) {
      setStatus({ message: 'Failed to fetch tasks', type: 'error' })
      setLoading(false)
      console.error(error);
    }
  }

  const addTask = async (e) => {
    e.preventDefault()
    
    if (!newTaskTitle.trim()) {
      setStatus({ message: 'Task title cannot be empty', type: 'error' })
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskTitle }),
      })

      const data = await response.json()

      if (response.ok) {
        setTasks([...tasks, data.task])
        setNewTaskTitle('')
        setStatus({ message: 'Task added successfully!', type: 'success' })
      } else {
        setStatus({ message: data.error || 'Failed to add task', type: 'error' })
      }
    } catch (error) {
      console.error(error);
      setStatus({ message: 'Failed to add task', type: 'error' })
    }
  }

  return (
    <div className="App">
      <h1 className="header">Flask + React + Vite POC</h1>
      
      {status.message && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}

      <div className="add-task">
        <h3>Add New Task</h3>
        <form onSubmit={addTask}>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title..."
          />
          <button type="submit">Add Task</button>
        </form>
      </div>

      <div className="tasks">
        <h3>Tasks</h3>
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <p>No tasks yet. Add one above!</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task">
              <strong>#{task.id}</strong> - {task.title}
              {task.completed && <span> ✅</span>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App