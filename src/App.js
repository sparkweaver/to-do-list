import React, { useState, useEffect } from "react";
import "./App.css";

const checkSound = new Audio("/pencil-check.mp3");
const uncheckSound = new Audio("/pencil-eraser.mp3");
checkSound.volume = 0.2;

function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(0);

  // Fetch tasks from the server based on the current user
  useEffect(() => {
    const fetchUrl =
      currentUser === 0
        ? "https://jsonplaceholder.typicode.com/todos"
        : `https://jsonplaceholder.typicode.com/todos?userId=${currentUser}`;

    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [currentUser]);

  // Updates a task's completion status on the server
  const updateTaskOnServer = (id, completed) => {
    return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ completed: completed }),
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((error) => console.error("Error updating task:", error));
  };

  // Toggle the completion status of a single task
  const toggleTaskCompletion = (id, completed) => {
    const updatedTasks = tasks.map((task) => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    if (completed) {
      uncheckSound.play();
    } else {
      checkSound.play();
    }
    setTasks(updatedTasks);

    const allTasksAreCompleted = updatedTasks.every((task) => task.completed);
    setAllChecked(allTasksAreCompleted);

    updateTaskOnServer(id, !completed);
  };

  // Marks all tasks as completed
  const checkAllTasks = () => {
    if (allChecked) {
      return;
    }

    const updatedTasks = tasks.map((task) => {
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

  // Cycles through users 1-10 and resets to user 0 (all users)
  const toggleUsers = () => {
    setCurrentUser((prev) => (prev + 1) % 11);
  };

  // Filter and sort tasks based on search term and completion status
  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.completed - b.completed);

  return (
    <div className="App">
      <header>
        <h1>Todo List</h1>
        <button
          className="image-button"
          onClick={toggleUsers}
          aria-label={`Toggle to ${
            currentUser === 10 ? "all users" : "user " + (currentUser + 1)}`}
        >
          <img src="/book.png" alt="Book" />
          User: {currentUser === 0 ? "A" : currentUser}
        </button>
      </header>
      <main>
        <section className="task-actions-section">
          <button
            onClick={checkAllTasks}
            aria-label="Mark all tasks as completed"
          >
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
                  aria-label={`Mark ${task.title} as ${
                    task.completed ? "incomplete" : "completed"
                  }`}
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
