
import checkBox from "../assets/check-box.svg";
import checkBoxChecked from "../assets/check-box-checked.svg";
import deleteIcon from "../assets/delete-icon.svg";
import Image from 'next/image';

const ListCard = (props) => {
  const { id, done, taskTitle, onClickItem, onClickDelete } = props;

  const atCheckBoxClick = () => onClickItem(id);
  const atDeleteClick = () => onClickDelete(id);

  return (
    <li
      className={`p-3 text-base ${
        done ? "line-through text-gray-700" : "text-gray-800"
      }`}
    >
      <div className="flex">
        <button onClick={atCheckBoxClick}>
          {done ? (
            <Image src={checkBoxChecked} alt="checked" className="w-6 h-6" />
          ) : (
            <Image src={checkBox} alt="unchecked" className="w-6 h-6" />
          )}
        </button>
        <div className="flex justify-between items-center w-full">
          <div className="text-md ml-3">{taskTitle}</div>
          <button onClick={atDeleteClick} className="pr-2">
            <Image src={deleteIcon} alt="delete" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default ListCard;