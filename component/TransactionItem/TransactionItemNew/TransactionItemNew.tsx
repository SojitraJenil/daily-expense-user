import React from "react";
import {
  MdDateRange,
  MdEdit,
  MdDelete,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

interface TransactionItemProps {
  transaction?: any;
  fuel?: any;
  Time: string;
  onEdit: (transaction: any) => void;
  onDelete: (id: any | undefined) => Promise<void>;
  name: string;
}

const TransactionItemNew: React.FC<TransactionItemProps> = ({
  transaction,
  fuel,
  name,
  Time,
  onEdit,
  onDelete,
}) => {
  const bgColor =
    transaction?.type === "income"
      ? "bg-green-50"
      : transaction?.type === "expense"
      ? "bg-red-50"
      : transaction?.type === "invest"
      ? "bg-blue-50"
      : "bg-white";

  const borderColor =
    transaction?.type === "income"
      ? "border-green-200"
      : transaction?.type === "expense"
      ? "border-red-200"
      : transaction?.type === "invest"
      ? "border-blue-200"
      : "border-gray-200";

  const iconColor =
    transaction?.type === "income"
      ? "text-green-600"
      : transaction?.type === "expense"
      ? "text-red-600"
      : transaction?.type === "invest"
      ? "text-blue-600"
      : "text-gray-600";

  return name == "Transaction" ? (
    <div
      className={`${bgColor} shadow-lg rounded-lg p-2 mb-4 border ${borderColor} hover:shadow-xl transition-shadow duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <div className={`rounded-full p-2 ${iconColor}`}>
            {transaction.type === "income" ? (
              <MdArrowUpward className="text-2xl" />
            ) : transaction.type === "expense" ? (
              <MdArrowDownward className="text-2xl" />
            ) : (
              <ArrowOutwardIcon className="text-2xl" />
            )}
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {transaction.desc || fuel.Currentkm}
          </div>
        </div>
        <span className="text-lg font-bold text-gray-800">
          ₹{transaction?.amount}
        </span>
      </div>
      <div className="flex items-center space-x-2 text-gray-500 justify-between">
        <div className="flex items-center space-x-2">
          <MdDateRange className="text-xl ms-1" />
          <p>{Time}</p>
        </div>
        <div className="flex space-x-4">
          <MdEdit
            onClick={() => onEdit(transaction)}
            className="text-blue-500 text-2xl cursor-pointer hover:text-blue-700"
          />
          <MdDelete
            onClick={() => onDelete(transaction)}
            className="text-red-500 text-2xl cursor-pointer hover:text-red-700"
          />
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`bg-yellow-100 shadow-lg rounded-lg p-2 mb-4 border border-yellow-500 hover:shadow-xl transition-shadow duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <div className={`rounded-full p-2 bg-slate-300`}></div>
          <div className="text-lg font-semibold text-gray-800">
            Currentkm: {fuel?.Currentkm}
          </div>
        </div>
        <span className="text-lg font-bold text-gray-800">
          Price : {fuel?.fuelPrice}₹
        </span>
      </div>
      <div className="flex items-center space-x-2 text-gray-500 justify-between">
        <div className="flex items-center space-x-2">
          <MdDateRange className="text-xl ms-1" />
          <p>{Time}</p>
        </div>
        <div className="flex space-x-4">
          <MdEdit
            onClick={() => onEdit(fuel)}
            className="text-blue-500 text-2xl cursor-pointer hover:text-blue-700"
          />
          <MdDelete
            onClick={() => onDelete(fuel._id)}
            className="text-red-500 text-2xl cursor-pointer hover:text-red-700"
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionItemNew;
