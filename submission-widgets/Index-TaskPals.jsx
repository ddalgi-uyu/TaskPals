import { useState, useEffect } from "react";
import Lottie from "lottie-react";

import addIcon from "./Assets-TaskPals/add-icon.svg";
import checkBox from "./Assets-TaskPals/check-box.svg";
import checkBoxChecked from "./Assets-TaskPals/check-box-checked.svg";
import deleteIcon from "./Assets-TaskPals/delete-icon.svg";

import PinkEgg from "./Assets-TaskPals/egg_pink_2.json";
import PinkKitten from "./Assets-TaskPals/kitten_pink_2.json";
import PinkCat from "./Assets-TaskPals/cat_pink_2.json";
import BlueEgg from "./Assets-TaskPals/egg_blue_2.json";
import BlueKitten from "./Assets-TaskPals/kitten_blue_2.json";
import BlueCat from "./Assets-TaskPals/cat_blue_2.json";
import YellowEgg from "./Assets-TaskPals/egg_yellow_2.json";
import YellowKitten from "./Assets-TaskPals/kitten_yellow_2.json";
import YellowCat from "./Assets-TaskPals/cat_yellow_2.json";

const pets = [
  { baby: PinkEgg, juvenile: PinkKitten, mature: PinkCat },
  { baby: BlueEgg, juvenile: BlueKitten, mature: BlueCat },
  { baby: YellowEgg, juvenile: YellowKitten, mature: YellowCat },
];

const PetProgressBar = ({ taskForProgressBar, onResetProgress }) => {
  // pet
  const [currentPet, setCurrentPet] = useState(
    pets[Math.floor(Math.random() * pets.length)]
  );
  const [isEvolutionComplete, setIsEvolveComplete] = useState(false);

  // task
  const eggStageLimit = 3;
  const juvenileStageLimit = 5;
  const fullGrownStage = eggStageLimit + juvenileStageLimit;

  // determine animation
  const currentPetAnimation =
    taskForProgressBar >= fullGrownStage
      ? currentPet.mature
      : taskForProgressBar >= eggStageLimit
      ? currentPet.juvenile
      : currentPet.baby;

  // determine progress bar
  const currentStageLimit =
    taskForProgressBar < eggStageLimit
      ? eggStageLimit
      : taskForProgressBar < fullGrownStage
      ? juvenileStageLimit
      : juvenileStageLimit;
  const currentStageOffset =
    taskForProgressBar < eggStageLimit ? 0 : eggStageLimit;

  // progress bar width
  const barWidth = 200;
  const rectangleWidth = barWidth / currentStageLimit;

  // start new egg when complete
  useEffect(() => {
    if (taskForProgressBar >= fullGrownStage && !isEvolutionComplete) {
      setIsEvolveComplete(true);
      setTimeout(() => {
        setCurrentPet(pets[Math.floor(Math.random() * pets.length)]);
        onResetProgress();
        setIsEvolveComplete(false);
      }, 3000);
    }
  }, [taskForProgressBar, isEvolutionComplete, onResetProgress]);

  return (
    <div className="p-6 mx-auto bg-white rounded-xl shadow-lg">
      <div className="flex justify-between gap-5">
        {/* -------------- Current Pet ------------- */}
        <div>
          <Lottie
            animationData={currentPetAnimation}
            style={{ width: 50, height: 50 }}
          />
        </div>

        {/* ----------- Progressbar ----------- */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              gap: "5px",
              width: barWidth,
              height: "20px",
            }}
          >
            {Array.from({ length: currentStageLimit }).map((_, index) => (
              <div
                key={index}
                style={{
                  width: rectangleWidth,
                  height: "100%",
                  borderRadius: "5px",
                  backgroundColor:
                    index + currentStageOffset < taskForProgressBar
                      ? "#84cc16"
                      : "#e5e7eb",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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

const ListCard = (props) => {
  const { id, done, taskTitle, onClickItem, onClickDelete } = props;

  const atCheckBoxClick = () => onClickItem(id);
  const atDeleteClick = () => onClickDelete(id);

  return (
    <li
      className={`p-3 text-base ${
        done ? "line-through text-gray-500" : "text-gray-800"
      }`}
    >
      <div className="flex">
        <button onClick={atCheckBoxClick}>
          {done ? (
            <img src={checkBoxChecked} alt="checked" className="w-6 h-6" />
          ) : (
            <img src={checkBox} alt="unchecked" className="w-6 h-6" />
          )}
        </button>
        <div className="flex justify-between items-center w-full">
          <div className="text-md ml-3">{taskTitle}</div>
          <button onClick={atDeleteClick} className="pr-2">
            <img src={deleteIcon} alt="delete" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </li>
  );
};

const Index = () => {
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
          <PetProgressBar
            taskForProgressBar={taskForProgressBar}
            onResetProgress={onResetProgress}
          />

          <div className="flex justify-between items-center w-full">
            <div className="pl-2">Today</div>
            <button onClick={atClickAdd} className="pr-2">
              <img src={addIcon} />
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

export default Index;
