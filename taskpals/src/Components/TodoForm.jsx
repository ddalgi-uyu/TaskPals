import { useState } from "react";

const TodoForm = ({ onAddItem }) => {
  const [input, setInput] = useState("");

  const atSubmit = (e) => {
    e.preventDefault();
    if (input === "") {
      return;
    }
    setInput("");
    onAddItem(input);
  };

  return (
    <ul>
      <li className="rounded-xl p-2 shadow-md bg-white">
        <div className="w-full">
          <form onSubmit={atSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              placeholder="New task..."
              className="text-md pl-4 w-full"
            />
          </form>
        </div>
      </li>
    </ul>
  );
};

export default TodoForm;