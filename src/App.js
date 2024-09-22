import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [allChecked, setAllChecked] = useState(false);

  const checkSound = new Audio("/pencil-check.mp3");
  const uncheckSound = new Audio("/pencil-eraser.mp3");
  checkSound.volume = 0.2;

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?userId=1')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const updateTaskOnServer = (id, completed) => {
    return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ completed : completed })
    })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((error) => console.error('Error updating task:', error));
  };

  const toggleTaskCompletion = (id, completed) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        if (task.completed) {
          uncheckSound.play();
        } else {
          checkSound.play();
        }
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);

    const allTasksNowCompleted = updatedTasks.every(task => task.completed);
    setAllChecked(allTasksNowCompleted);

    updateTaskOnServer(id, !completed);
  };

  const checkAllTasks = () => {
    if (allChecked) {
      return;
    }

    const updatedTasks = tasks.map(task => {
      if (!task.completed) {
        updateTaskOnServer(task.id, true);
        return { ...task, completed: true };
      }
      return task;
    });

    checkSound.play();
    setTasks(updatedTasks);
    setAllChecked(true);
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.completed - b.completed);

  return (
    <div className="App">
    <header>
      <h1>Todo List</h1>
    </header>
    <main>
      <section className="task-actions-section">
        <button onClick={checkAllTasks} aria-label="Mark all tasks as completed">
          Check All
        </button>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
          aria-label="Search for tasks"
        />
      </section>

      <section className="task-list-section">
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li key={task.id} className={task.completed ? "completed" : ""}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id, task.completed)}
                aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'completed'}`}
              />
              <p>{task.title}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  </div>
  );
}

export default App;
