/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import moment from "moment";
import Cookies from "universal-cookie";
import TransactionItem from "component/TransactionItem/TransactionItem";
import TransactionFormModal from "component/TransactionFormModal/TransactionFormModal";
import {
  addExpense,
  deleteExpense,
  getUser,
  showAllExpenses,
  showProfile,
  updateExpense,
} from "API/api";
import Swal from "sweetalert2";
import { useAtom } from "jotai";
import {
  NavigateNameAtom,
  TotalExpense,
  TotalIncome,
  TotalInvest,
  userAtom,
  userGraphExpense,
  userProfileName,
} from "atom/atom";
import dynamic from "next/dynamic";
import TransactionItemNew from "component/TransactionItem/TransactionItemNew/TransactionItemNew";

interface Transaction {
  id?: string;
  type: "expense" | "income";
  desc: string;
  amount: number;
  timestamp: any;
  mobileNumber: string;
}

const Home: React.FC = () => {
  const cookies = new Cookies();
  const authToken = cookies.get("token");
  const mobileNumber = cookies.get("mobileNumber");
  const [isOpen, setIsOpen] = useState(false);

  const [totalExpense, setTotalExpense] = useAtom(TotalExpense);
  const [totalIncome, setTotalIncome] = useAtom(TotalIncome);
  const [totalInvest, setTotalInvest] = useAtom(TotalInvest);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavigate] = useAtom(NavigateNameAtom);
  const [, setUserProfileName] = useAtom(userProfileName);
  const [, setUserGraphExpense] = useAtom(userGraphExpense);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const initialFormValues = {
    type: "",
    desc: "",
    amount: 0,
    timestamp: null,
    mobileNumber: mobileNumber,
  };

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setSelectedTransaction(null);
  };

  const fetchProfileData = async () => {
    const userId = cookies.get("UserId");
    try {
      const response = await showProfile(userId);
      if (response && response.user) {
        setUserProfileName(response.user.name);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchAllData();
  }, [transactions, isNavigate]);
  const [, setUsers] = useAtom(userAtom);
  const fetchAllData = async () => {
    try {
      const response = await getUser();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTransactions = async () => {
    // setLoading(true);
    // if (!authToken) {
    //   setLoading(false);
    //   return;
    // }
    try {
      // if (!transactionsData || !transactionsData.data) {
      //   console.error("No data fetched");
      //   setLoading(false);
      //   return;
      // }
      const transactionsData = await showAllExpenses();
      const sortedTransactions = transactionsData.data.sort(
        (a: any, b: any) => {
          return moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf();
        }
      );
      const normalizedMobileNumber = String(mobileNumber).trim();
      const filteredTransactions = sortedTransactions.filter(
        (item: { mobileNumber: string }) =>
          String(item.mobileNumber).trim() === normalizedMobileNumber
      );
      const formattedTransactions = filteredTransactions.map((item: any) => ({
        id: item._id,
        type: item.type.toLowerCase(),
        desc: item.desc,
        amount: parseFloat(item.amount),
        timestamp: item.timestamp,
        mobileNumber: item.mobileNumber,
      }));
      const totalExpense = formattedTransactions
        .filter((item: { type: string }) => item.type === "expense")
        .reduce((acc: any, item: { amount: any }) => acc + item.amount, 0);
      const totalIncome = formattedTransactions
        .filter((item: { type: string }) => item.type === "income")
        .reduce((acc: any, item: { amount: any }) => acc + item.amount, 0);
      const totalInvest = formattedTransactions
        .filter((item: { type: string }) => item.type === "invest")
        .reduce((acc: any, item: { amount: any }) => acc + item.amount, 0);
      setTotalExpense(totalExpense);
      setTotalIncome(totalIncome);
      setTotalInvest(totalInvest);
      setTransactions(formattedTransactions);
      setUserGraphExpense(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [authToken, mobileNumber]);

  const handleOpenUpdateModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setUpdateModalOpen(true);
  };

  const addTransaction = async (formValues: any) => {
    try {
      await addExpense(formValues);
      handleClose();
      fetchTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const updateTransaction = async (formValues: any) => {
    if (!selectedTransaction) return;

    try {
      await updateExpense(selectedTransaction.id!, formValues);
      setUpdateModalOpen(false);
      setSelectedTransaction(null);
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const deleteTransaction = async (id: string | undefined) => {
    if (!id) return; // Handle the case where id might be undefined
    Swal.fire({
      title: "Are you sure you want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteExpense(id);
          setTransactions(
            transactions.filter((transaction) => transaction.id !== id)
          );
        } catch (error) {
          console.error("Error deleting transaction: ", error);
          Swal.fire({
            title: "Error",
            text: "Failed to delete transaction.",
            icon: "error",
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-full my-[250px]">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card className="py-6 px-2 border h-[100%] mb-0 border-solid border-gray-50 overflow-hidden">
      <Box className="mb-5 pt-2 w-full flex justify-center items-center gap-4">
        <Box className="w-32 bg-red-50 p-4 border-2 border-solid border-[#db8f8f] rounded-lg flex flex-col items-center justify-center">
          <ArrowUpwardIcon className="text-red-500 text-3xl mb-2" />
          <Typography className="text-gray-500 mb-2 text-center">
            Expense
          </Typography>
          <Typography variant="h6" className="text-gray-700">
            ₹{totalExpense}
          </Typography>
        </Box>
        <Box className="w-32 bg-green-50 p-4 border-2 border-solid border-green-400	 rounded-lg flex flex-col items-center justify-center">
          <ArrowDownwardIcon className="text-green-500 text-3xl mb-2" />
          <Typography className="text-gray-500 mb-2 text-center">
            Income
          </Typography>
          <Typography variant="h6" className="text-gray-700 text-sm">
            ₹{totalIncome}
          </Typography>
        </Box>
        <Box className="w-32 bg-blue-50 p-4 border-2 border-solid border-blue-400	 rounded-lg flex flex-col items-center justify-center">
          <ArrowDownwardIcon className="text-blue-500 text-3xl mb-2" />
          <Typography className="text-gray-500 mb-2 text-center">
            Invest
          </Typography>
          <Typography variant="h6" className="text-gray-700 text-sm">
            ₹{totalInvest}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ paddingBottom: 2, marginLeft: 10, marginRight: 10 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          fullWidth
          className="px-8 py-2  text-white bg-blue-700 rounded transition duration-75 ease-in-out hover:bg-green-400 transform mt-6 align-middle justify-center flex mx-auto"
        >
          Add Expense
        </Button>
      </Box>

      <Divider className="my-4" />

      <Typography className="py-2 text-black  font-bold">
        Expense History
      </Typography>
      {transactions &&
        transactions.map(
          (item, index) =>
            item.type === "expense" && (
              <div key={item.id}>
                {(index === 0 ||
                  moment(item.timestamp).format("DD-MM-YYYY") !==
                    moment(transactions[index - 1].timestamp).format(
                      "DD-MM-YYYY"
                    )) && (
                  <div className="mt-8 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg text-center py-3 px-6 rounded-lg shadow-lg border border-blue-700">
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
    </Card>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
