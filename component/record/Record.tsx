/* eslint-disable react-hooks/exhaustive-deps */
import { Skeleton } from "@mui/material";
import TransactionFormModal from "component/TransactionFormModal/TransactionFormModal";
import TransactionItemNew from "component/TransactionItem/TransactionItemNew/TransactionItemNew";
import useHome from "context/HomeContext";
import moment from "moment";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";

interface Transaction {
  id?: string;
  type: "expense" | "income" | "invest";
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
    OnSearchRecord,
    isOpen,
    setUpdateModalOpen,
    updateModalOpen,
    fetchTransactions,
    addTransaction,
    deleteLoading,
    updateTransaction,
    onBtnFilterRecord,
    deleteTransaction,
  } = useHome();

  const initialFormValues = {
    type: "",
    desc: "",
    amount: 0,
    timestamp: null,
    mobileNumber: mobileNumber,
  };

  const [loading, setLoading] = useState(true);
  const [FilterStatus, setFilterStatus] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleOpenUpdateModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setUpdateModalOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedTransaction(null);
  };

  const RemoveAllFilter = () => {
    fetchTransactions();
    setFilterStatus(false);
  };

  useEffect(() => {
    fetchTransactions().finally(() => setLoading(false));
  }, []);

  const TransactionSkeleton = () => (
    <div className="p-4 py-6 rounded-lg shadow-md mb-4 bg-gray-50">
      {/* Date Skeleton */}
      <Skeleton variant="text" width={100} height={25} className="mb-2" />

      {/* Icon and Title Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={150} height={25} className="ml-4" />
      </div>

      {/* Time and Actions Skeleton */}
      <div className="flex items-center justify-between mt-4">
        <Skeleton variant="text" width={50} height={20} />
        <div className="flex space-x-2">
          <Skeleton variant="rectangular" width={24} height={24} />
          <Skeleton variant="rectangular" width={24} height={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-4 pt-5 mx-3">
      <div className="flex mt-2 mb-5 items-center justify-between bg-gray-100 p-3 rounded-full shadow-md max-w-md mx-auto">
        <SearchIcon className="text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          onChange={OnSearchRecord}
          className="flex-grow bg-transparent outline-none px-3 text-gray-700"
        />
        <MicIcon className="text-gray-500" />
      </div>
      <div className="flex justify-evenly mb-4">
        <button
          onClick={() => {
            onBtnFilterRecord("invest")();
            setFilterStatus(true);
          }}
          className="bg-blue-200 border-blue-500 border rounded-lg px-5 p-1"
        >
          invest
        </button>
        <button
          onClick={() => {
            onBtnFilterRecord("income")();
            setFilterStatus(true);
          }}
          className="bg-green-200 border-green-500 border rounded-lg px-5 p-1"
        >
          income
        </button>

        <button
          onClick={() => {
            onBtnFilterRecord("expense")();
            setFilterStatus(true);
          }}
          className="bg-red-200 border-red-500 border rounded-lg px-5 p-1"
        >
          expense
        </button>
      </div>
      {FilterStatus == true && (
        <div className="">
          <button
            onClick={RemoveAllFilter}
            className="bg-yellow-200 border ms-2 border-yellow-500 rounded-lg px-2"
          >
            Remove Filter <CloseIcon />
          </button>
        </div>
      )}

      <div>
        {loading || deleteLoading ? (
          <>
            <TransactionSkeleton />
            <TransactionSkeleton />
            <TransactionSkeleton />
          </>
        ) : transactions && transactions.length > 0 ? (
          transactions.map(
            (item: Transaction, index: number) =>
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
                      <div className="bg-gradient-to-r from-teal-600 to-purple-700 rounded-lg transition-transform duration-300 ease-in-out text-white font-bold text-lg text-center py-1 px-6">
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
          )
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-xl font-semibold text-gray-500">
              No Records Found
            </p>
          </div>
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

export default dynamic(() => Promise.resolve(Record), { ssr: false });
