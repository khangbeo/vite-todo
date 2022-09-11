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
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Create
  const addTodo = (e) => {
    e.preventDefault();
    if (todo !== '') {
      const newTodo = {
        id: getUUID(),
        text: todo,
      };
      setTodos([...todos, newTodo]);
    }

    if (todo === '') {
      setError('Please enter a todo');
    } else {
      setError('');
    }
    setTodo('');
  };

  // edit flow works like this
  // when user click edit button, we setIsEditing to true so the app knows we're in edit mode
  // then we store the current todo item that was clicked into a new state variable
  // when user type a text in the edit form, we update the currentTodo state variable with updated info
  // when user submit the form, we call updateTodo function with currentTodo's id and state value
  // next, we map the todos array and return a new array where the currentTodo's id matches the current index's id
  // if it matches, then the new array will contain updated todo, if not, then nothing changes
  // then we set old todos array with the updated todos

  // Edit
  function handleEditClick(todo) {
    setIsEditing(true);
    setCurrentTodo({ ...todo });
  }

  function handleEditInputChange({ target }) {
    setCurrentTodo({ ...currentTodo, text: target.value });
  }

  function handleEditFormSubmit(e) {
    e.preventDefault();
    handleUpdateTodo(currentTodo.id, currentTodo);
  }

  function handleUpdateTodo(id, updatedTodo) {
    const updatedItem = todos.map((todo) => {
      return todo.id === id ? updatedTodo : todo;
    });
    setIsEditing(false);
    setTodos(updatedItem);
  }

  // Delete
  const removeTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setError('');
    setTodos(newTodos);
  };

  const handleFormChange = ({ target }) => {
    setTodo(target.value);
  };

  return (
    <div>
      <h1>Vite To Do List</h1>

      <form onSubmit={addTodo}>
        <input
          type="text"
          name="text"
          value={todo}
          onChange={handleFormChange}
          placeholder="Add todo"
        />
      </form>
      {error.length > 0 && <p>{error}</p>}

      <div>
        {todos.length === 0 && <p>No todos yet</p>}
        {todos.map((todo) => (
          <div key={todo.id}>
            {isEditing && todo.id === currentTodo.id ? (
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

            {isEditing && todo.id === currentTodo.id ? (
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
