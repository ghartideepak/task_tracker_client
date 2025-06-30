import React, { useEffect, useState } from 'react';
import AddTaskForm from './AddTaskForm';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tasks from backend
  const fetchTasks = () => {
    fetch('http://localhost:5000/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
        setLoading(false);
      });
  };

  // Fetch once when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task callback from AddTaskForm
  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // DELETE task
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      console.log(result.message);

      // Remove from UI
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // TOGGLE completed status (PUT)
  const handleToggle = async (task) => {
    try {
      const updated = { ...task, completed: !task.completed };

      const res = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      const updatedTask = await res.json();

      // Update state in frontend
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      <h2>Task List</h2>
      <AddTaskForm onTaskAdded={handleTaskAdded} />

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </span>

            {/* Toggle complete button */}
            <button
              onClick={() => handleToggle(task)}
              style={{ marginLeft: '10px' }}
            >
              {task.completed ? 'Undo' : '✅ Done'}
            </button>

            {/* Delete button */}
            <button
              onClick={() => handleDelete(task._id)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
