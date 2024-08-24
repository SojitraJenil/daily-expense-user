import React from "react";
import { MdCurrencyRupee, MdDateRange, MdEdit, MdDelete } from "react-icons/md";

interface TransactionItemProps {
  transaction: {
    id?: string;
    desc: string;
    amount: number;
  };
  Time: string;
  onEdit: (transaction: any) => void;
  onDelete: (id: string | undefined) => Promise<void>;
}

const TransactionItemNew: React.FC<TransactionItemProps> = ({
  transaction,
  Time,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MdCurrencyRupee className="text-blue-500 text-2xl" />
          <h2 className="text-xl font-semibold text-gray-800">
            {transaction.desc}
          </h2>
        </div>
        <span className="text-lg font-bold text-green-600">
          ₹{transaction.amount.toFixed(2)}
        </span>
      </div>
      <div className="flex items-center space-x-2 text-gray-500">
        <MdDateRange className="text-xl" />
        <p>{Time}</p>
      </div>
      <div className="flex mt-4 space-x-4">
        <MdEdit
          onClick={() => onEdit(transaction)}
          className="text-blue-500 text-2xl cursor-pointer hover:text-blue-700"
        />
        <MdDelete
          onClick={() => onDelete(transaction.id)}
          className="text-red-500 text-2xl cursor-pointer hover:text-red-700"
        />
      </div>
    </div>
  );
};

export default TransactionItemNew;
