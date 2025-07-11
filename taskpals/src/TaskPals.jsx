import { useState} from "react";
import ListCard from "./Components/ListCard";
import PetProgressBar from "./Components/PetProgressBar";
import TodoForm from "./Components/TodoForm";
import addIcon from "./Assets-TaskPals/add-icon.svg";

const TaskPals = () => {
  const initialList = [];
  const [toDoList, setToDoList] = useState(initialList);
  const [createNewItem, setCreateNewItem] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(0);
  const [taskForProgressBar, setTaskForProgressBar] = useState(0);

  const atAddItem = (text) => {
    const item = {
      id: new Date().getTime().toString(),
      title: text,
      done: false,
    };
    setToDoList(toDoList.concat(item));
    setCreateNewItem(false);
  };

  const atClickItem = (id) => {
    const newList = toDoList.map((item) => {
      if (item.id === id) {
        if (!item.done) {
          setTaskCompleted((counter) => counter + 1);
          setTaskForProgressBar((counter) => counter + 1);
        } else {
          setTaskCompleted((counter) => counter - 1);
          setTaskForProgressBar((counter) => Math.max(counter - 1, 0));
        }
        return {
          id: item.id,
          title: item.title,
          done: !item.done,
        };
      }

      return item;
    });
    setToDoList(newList);
  };

  const atClickDelete = (id) => {
    const newList = toDoList.filter((item) => item.id !== id);
    setToDoList(newList);
  };

  const atClickAdd = () => {
    setCreateNewItem(true);
  };

  // Reset only progress bar count
  const onResetProgress = () => {
    setTaskForProgressBar(0);
  };

  return (
    <div className="w-110">
      <div className="p-4 h-100 bg-white rounded-xl shadow-lg">
        <div className="space-y-4">
          <div className="bg-red-500 text-white p-4">If this is red, Tailwind works!</div>
          <PetProgressBar
            taskForProgressBar={taskForProgressBar}
            onResetProgress={onResetProgress}
          />

          <div className="flex justify-between items-center w-full">
            <div className="pl-2">Today</div>
            <button onClick={atClickAdd} className="pr-2">
              <img src={addIcon} alt="Add icon"/>
            </button>
          </div>

          <div className="flex flex-col h-50">
            {createNewItem ? <TodoForm onAddItem={atAddItem}/> : null}

            {toDoList.length ? (
              <ul className={`flex-1${createNewItem ? 'h-11/12' : 'h-full'} overflow-y-auto scrollbar-thumb-gray-300 scrollbar-track-transparent rounded-xl p-2 shadow-md bg-white`}>
                {toDoList.map((toDoItem) => (
                  <ListCard
                    key={toDoItem.id}
                    id={toDoItem.id}
                    done={toDoItem.done}
                    taskTitle={toDoItem.title}
                    onClickItem={atClickItem}
                    onClickDelete={atClickDelete}
                  />
                ))}
              </ul>
            ) : null}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TaskPals;
