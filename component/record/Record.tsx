/* eslint-disable react-hooks/exhaustive-deps */
import { Skeleton } from "@mui/material";
import TransactionFormModal from "component/TransactionFormModal/TransactionFormModal";
import TransactionItemNew from "component/TransactionItem/TransactionItemNew/TransactionItemNew";
import useHome from "context/HomeContext";
import moment from "moment";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

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
    isOpen,
    setUpdateModalOpen,
    updateModalOpen,
    fetchTransactions,
    addTransaction,
    deleteLoading,
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

  const [loading, setLoading] = useState(true);
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
