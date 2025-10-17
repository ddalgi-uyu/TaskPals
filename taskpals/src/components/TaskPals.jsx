'use client';

import { useState, useEffect } from "react";
import ListCard from "./ListCard";
import PetProgressBar from "./PetProgressBar";
import TodoForm from "./TodoForm";
import Image from 'next/image';
import addIcon from "../assets/add-icon.svg";

const STORAGE_KEYS = {
  TODO_LIST: 'todoList',
  PROGRESS_BAR: 'taskForProgressBar',
  PET_INDEX: 'currentPetIndex',
};

const TaskPals = () => {
  const [toDoList, setToDoList] = useState([]);
  const [createNewItem, setCreateNewItem] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(0);
  const [taskForProgressBar, setTaskForProgressBar] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedTodoList = localStorage.getItem(STORAGE_KEYS.TODO_LIST);
      if (savedTodoList) {
        const parsedList = JSON.parse(savedTodoList);
        setToDoList(parsedList);
        const completedCount = parsedList.filter(item => item.done).length;
        setTaskCompleted(completedCount);
      }

      const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS_BAR);
      if (savedProgress) {
        setTaskForProgressBar(parseInt(savedProgress, 10));
      }

      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEYS.TODO_LIST, JSON.stringify(toDoList));
      } catch (error) {
        console.error('Error saving todo list:', error);
      }
    }
  }, [toDoList, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEYS.PROGRESS_BAR, taskForProgressBar.toString());
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  }, [taskForProgressBar, isLoaded]);

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
    const item = toDoList.find(item => item.id === id);
    
    if (item && item.done) {
      setTaskCompleted((counter) => counter - 1);
      // setTaskForProgressBar((counter) => Math.max(counter - 1, 0));
    }
    
    const newList = toDoList.filter((item) => item.id !== id);
    setToDoList(newList);
  };

  const atClickAdd = () => {
    setCreateNewItem(true);
  };

  const onResetProgress = () => {
    setTaskForProgressBar(0);
  };

  // Reset with browser confirmation
  const handleReset = () => {
    if (window.confirm('Reset everything? This will delete all tasks and reset your pet.')) {
      // Clear state
      setToDoList([]);
      setTaskCompleted(0);
      setTaskForProgressBar(0);
      
      // Clear localStorage
      localStorage.clear(); 
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-110">
        <div className="p-4 h-100 bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-110">
      <div className="p-4 h-100 bg-white rounded-xl shadow-lg">
        <div className="space-y-4">

          {/*Pet Progress Bar*/}
          <PetProgressBar
            taskForProgressBar={taskForProgressBar}
            onResetProgress={onResetProgress}
          />

          {/*Title Bar*/}
          <div className="flex justify-between items-center w-full">
            <div className="pl-2 text-black font-semibold">
              Today {toDoList.length > 0 && `(${taskCompleted}/${toDoList.length})`}
            </div>
            <div className="flex gap-2 items-center">
              {toDoList.length > 0 && (
                <button
                  onClick={handleReset}
                  className="text-xs px-3 py-1 text-red-600 hover:bg-red-50 rounded transition font-semibold"
                  title="Reset everything"
                >
                  Reset
                </button>
              )}
              <button onClick={atClickAdd} className="pr-2 hover:opacity-70 transition">
                <Image src={addIcon} alt="Add icon"/>
              </button>
            </div>
          </div>

          <div className="flex flex-col h-50">
            {createNewItem ? <TodoForm onAddItem={atAddItem}/> : null}

            {toDoList.length ? (
              <ul className={`flex-1 ${createNewItem ? 'h-11/12' : 'h-full'} overflow-y-auto scrollbar-thumb-gray-300 scrollbar-track-transparent rounded-xl p-2 shadow-md bg-white`}>
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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>No tasks yet. Click + to add one!</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TaskPals;