import TransactionFormModal from "component/TransactionFormModal/TransactionFormModal";
import TransactionItemNew from "component/TransactionItem/TransactionItemNew/TransactionItemNew";
import moment from "moment";
import { useHome } from "pages/context/HomeContext";
import React, { useEffect, useState } from "react";

interface Transaction {
  id?: string;
  type: "expense" | "income";
  desc: string;
  amount: number;
  timestamp: any;
  mobileNumber: string;
}

const Record = () => {
  const {
    transactions,
    mobileNumber,
    setIsOpen,
    isOpen,
    setUpdateModalOpen,
    updateModalOpen,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useHome();

  const initialFormValues = {
    type: "",
    desc: "",
    amount: 0,
    timestamp: null,
    mobileNumber: mobileNumber,
  };

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  console.log("updateModalOpen", updateModalOpen);

  const handleOpenUpdateModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setUpdateModalOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedTransaction(null);
  };

  useEffect(() => {
    console.log("A");
    fetchTransactions();
  }, []);

  return (
    <div className="mt-4 pt-5">
      <div className="">
        {transactions &&
          transactions.map(
            (item, index) =>
              (item.type === "expense" ||
                item.type === "income" ||
                item.type === "invest") && (
                <div key={item.id}>
                  {(index === 0 ||
                    moment(item.timestamp).format("DD-MM-YYYY") !==
                      moment(transactions[index - 1].timestamp).format(
                        "DD-MM-YYYY"
                      )) && (
                    <div className="mt-2 mb-2">
                      <div className="bg-gradient-to-r from-teal-600 to-purple-700 rounded-lg transition-transform duration-300 ease-in-out text-white font-bold text-lg text-center py-1 px-6 ">
                        {moment(item.timestamp).format("DD-MM-YYYY")}
                      </div>
                    </div>
                  )}
                  <TransactionItemNew
                    transaction={item}
                    onEdit={handleOpenUpdateModal}
                    onDelete={deleteTransaction}
                    Time={moment(item.timestamp).format("hh:mm A")}
                  />
                </div>
              )
          )}

        <TransactionFormModal
          open={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedTransaction(null);
          }}
          onSubmit={updateTransaction}
          initialValues={selectedTransaction || initialFormValues}
          title="Update Transaction"
          type={undefined}
        />

        <TransactionFormModal
          open={isOpen}
          onClose={handleClose}
          onSubmit={addTransaction}
          initialValues={initialFormValues}
          title="Add New Transaction"
          type={undefined}
        />
      </div>
    </div>
  );
};

export default Record;
