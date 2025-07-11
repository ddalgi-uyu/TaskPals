
import checkBox from "../Assets-TaskPals/check-box.svg";
import checkBoxChecked from "../Assets-TaskPals/check-box-checked.svg";
import deleteIcon from "../Assets-TaskPals/delete-icon.svg";

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

export default ListCard;