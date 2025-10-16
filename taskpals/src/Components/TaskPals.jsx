'use client';

import { useState} from "react";
import ListCard from "./ListCard";
import PetProgressBar from "./PetProgressBar";
import TodoForm from "./TodoForm";
import Image from 'next/image';
import addIcon from "../assets/add-icon.svg";

const TaskPals = () => {
  const initialList = [];
  const [toDoList, setToDoList] = useState(initialList);
  const [createNewItem, setCreateNewItem] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(0);
  const [taskForProgressBar, setTaskForProgressBar] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

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

  // Reset progress bar count
  const onResetProgress = () => {
    setTaskForProgressBar(0);
  };

  useEffect(() => {
    const saved = localStorage.getItem('todoList');
    if (saved) {
      setToDoList(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('todoList', JSON.stringify(toDoList));
    }
  }, [toDoList, isLoaded]);

  return (
    <div className="w-110">
      <div className="p-4 h-100 bg-white rounded-xl shadow-lg">
        <div className="space-y-4">

          <!-- Pet Progress Bar-->
          <PetProgressBar
            taskForProgressBar={taskForProgressBar}
            onResetProgress={onResetProgress}
          />

          <!-- Title Bar -->
          <div className="flex justify-between items-center w-full">
            <div className="pl-2 text-black">Today</div>
            <button onClick={atClickAdd} className="pr-2">
              <Image src={addIcon} alt="Add icon"/>
            </button>
          </div>

          <div className="flex flex-col h-50">
            <!-- Todo Form -->
            {createNewItem ? <TodoForm onAddItem={atAddItem}/> : null}

            <!-- List Card -->
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
