import React, { useState, useEffect } from "react";
import "./App.css";

const checkSound = new Audio("/pencil-check.mp3");
const uncheckSound = new Audio("/pencil-eraser.mp3");
checkSound.volume = 0.2;

function App() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(0);

  // Fetch todos from the server based on the current user
  useEffect(() => {
    const fetchUrl =
      currentUser === 0
        ? "https://jsonplaceholder.typicode.com/todos"
        : `https://jsonplaceholder.typicode.com/todos?userId=${currentUser}`;

    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        setAllChecked(isAllChecked(data));
      })
      .catch((error) => console.error("Error fetching todos:", error));
  }, [currentUser]);

  // Updates a todo's completion status on the server
  const updateTodoOnServer = (id, completed) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ completed: completed }),
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((error) => console.error("Error updating todo:", error));
  };

  // Toggle the completion status of a single todo
  const toggleTodoCompletion = (id, completed) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    completed ? uncheckSound.play() : checkSound.play();

    setTodos(updatedTodos);

    setAllChecked(isAllChecked(updatedTodos));

    updateTodoOnServer(id, !completed);
  };

  // Marks all todos as completed
  const checkAllTodos = () => {
    if (allChecked) return;

    const updatedTodos = todos.map((todo) =>
      !todo.completed
        ? (updateTodoOnServer(todo.id, true), { ...todo, completed: true })
        : todo
    );

    checkSound.play();
    setTodos(updatedTodos);
    setAllChecked(true);
  };

  // Check if all todos are completed
  const isAllChecked = (todos) => todos.every((todo) => todo.completed);

  // Cycles through users 1-10 and resets to user 0 (all users)
  const toggleUsers = () =>
    setCurrentUser((previousUser) => (previousUser + 1) % 11);

  // Filter and sort todos based on search term and completion status
  const filteredTodos = todos
    .filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.completed - b.completed);

  return (
    <div className="App">
      <header>
        <h1>Todo List</h1>
        <button
          className="image-button"
          onClick={toggleUsers}
          aria-label={`Toggle to ${
            currentUser === 10 ? "all users" : "user " + (currentUser + 1)
          }`}
        >
          <img src="/book.png" alt="Book" />
          User: {currentUser === 0 ? "A" : currentUser}
        </button>
      </header>
      <main>
        <section className="todo-actions-section">
          <button
            onClick={checkAllTodos}
            aria-label="Mark all todos as completed"
          >
            Check All
          </button>
          <input
            type="text"
            placeholder="Search todos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar"
            aria-label="Search for todos"
            name="search-todos"
          />
        </section>

        <section className="todo-list-section">
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo.id} className={todo.completed ? "completed" : ""}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoCompletion(todo.id, todo.completed)}
                  aria-label={`Mark ${todo.title} as ${
                    todo.completed ? "incomplete" : "completed"
                  }`}
                  id={`todo-${todo.id}`}
                />
                <p>{todo.title}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
