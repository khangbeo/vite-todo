import { useEffect, useState } from 'react';

const getUUID = () =>
  (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16)
  );

function App() {
  const [todo, setTodo] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (todo !== '') {
      const newTodo = {
        id: getUUID(),
        text: todo,
      };
      setTodos([...todos, newTodo]);
    }

    setText('');
  };

  function handleEditInputChange(e) {
    // set the new state value to what's currently in the edit input box
    setCurrentTodo({ ...currentTodo, text: e.target.value });
  }

  function handleEditClick(todo) {
    // set editing to true
    setIsEditing(true);
    // set the currentTodo to the todo item that was clicked
    setCurrentTodo({ ...todo });
  }

  function handleUpdateTodo(id, updatedTodo) {
    // here we are mapping over the todos array - the idea is check if the todo.id matches the id we pass into the function
    // if the id's match, use the second parameter to pass in the updated todo object
    // otherwise just use old todo
    const updatedItem = todos.map((todo) => {
      return todo.id === id ? updatedTodo : todo;
    });
    // set editing to false because this function will be used inside a onSubmit function - which means the data was submited and we are no longer editing
    setIsEditing(false);
    // update the todos state with the updated todo
    setTodos(updatedItem);
  }

  function handleEditFormSubmit(e) {
    e.preventDefault();

    // call the handleUpdateTodo function - passing the currentTodo.id and the currentTodo object as arguments
    handleUpdateTodo(currentTodo.id, currentTodo);
  }

  const removeTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const handleFormChange = ({ target }) => {
    setTodo(target.value);
  };

  return (
    <div className="App">
      <h1>Vite To Do List</h1>

      <form onSubmit={addTodo}>
        <input
          type="text"
          name="text"
          value={todo}
          onChange={handleFormChange}
          placeholder='Add todo'
        />
      </form>

      <div>
        {todos.map((todo) => (
          <div key={todo.id}>
            {isEditing ? (
              <form onSubmit={handleEditFormSubmit}>
                <input
                  name="editTodo"
                  type="text"
                  placeholder="Edit todo"
                  value={currentTodo.text}
                  onChange={handleEditInputChange}
                />
              </form>
            ) : (
              <p>{todo.text}</p>
            )}

            {isEditing ? (
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            ) : (
              <button onClick={() => handleEditClick(todo)}>Edit</button>
            )}

            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
