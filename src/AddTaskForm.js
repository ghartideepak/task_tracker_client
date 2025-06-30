import React, { useState } from 'react';

function AddTaskForm({ onTaskAdded, token }) { // accept token as prop
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    if (!title.trim()) return;

    try {
      // Send POST request to backend with Authorization header
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token // <-- add token here
        },
        body: JSON.stringify({ title }),
      });

      const newTask = await response.json();

      if (response.ok) {
        // Call parent callback to update UI
        onTaskAdded(newTask);
        setTitle(''); // clear input
      } else {
        alert(newTask.message || 'Failed to add task');
      }
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        placeholder="Enter task title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default AddTaskForm;
