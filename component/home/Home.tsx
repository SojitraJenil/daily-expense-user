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
  updateExpense,
} from "API/api";
import Swal from "sweetalert2";
import { useAtom } from "jotai";
import { userAtom } from "atom/atom";

interface Transaction {
  id?: string;
  type: "expense" | "income";
  desc: string;
  amount: number;
  timestamp: any;
  mobileNumber: string;
}

const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [totalExpense, setTotalExpense] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const cookies = new Cookies();
  const authToken = cookies.get("token");
  const [loading, setLoading] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const mobileNumber = cookies.get("mobileNumber");
  const initialFormValues = {
    type: "expense",
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

  useEffect(() => {
    fetchAllData();
  }, []);
  const [, setUsers] = useAtom(userAtom);
  const fetchAllData = async () => {
    try {
      const response = await getUser();
      console.log(response)
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTransactions = async () => {
    if (!authToken) {
      setLoading(false);
      return;
    }

    try {
      const transactionsData = await showAllExpenses();
      console.log("Fetched transactions data:", transactionsData);
      if (!transactionsData || !transactionsData.data) {
        console.error("No data fetched");
        setLoading(false);
        return;
      }
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
      setTotalExpense(totalExpense);
      setTransactions(formattedTransactions);
      console.log("Formatted transactions:", formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTransactions();
  }, []);

  const handleOpenUpdateModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setUpdateModalOpen(true);
  };

  const addTransaction = async (formValues: any) => {
    try {
      const response = await addExpense(formValues);
      console.log("Added transaction:", response);
      handleClose();
      fetchTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const updateTransaction = async (formValues: any) => {
    console.log("formValues", formValues);
    if (!selectedTransaction) return;

    try {
      const response = await updateExpense(selectedTransaction.id!, formValues);
      console.log("Updated transaction:", response);
      setUpdateModalOpen(false);
      setSelectedTransaction(null);
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };


  const deleteTransaction = async (id: string) => {
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
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
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
      <Box className="flex justify-center items-center h-full">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card className="p-6 border border-solid border-gray-50 overflow-hidden">
      <Box className="w-full flex justify-center items-center gap-4">
        <Box className="w-33 bg-gray-50 p-4 border border-solid border-gray-100 rounded-lg flex flex-col items-center justify-center">
          <ArrowUpwardIcon className="text-green-500 text-3xl mb-2" />
          <Typography className="text-gray-500 mb-2 text-center">
            Total Expense
          </Typography>
          <Typography variant="h6" className="text-gray-700">
            ₹{totalExpense}
          </Typography>
        </Box>
        <Box className="w-33 bg-gray-50 p-4 border border-solid border-gray-100 rounded-lg flex flex-col items-center justify-center">
          <ArrowUpwardIcon className="text-green-500 text-3xl mb-2" />
          <Typography className="text-gray-500 mb-2 text-center">
            Day Expense
          </Typography>
          <Typography variant="h6" className="text-gray-700 text-sm">
            coming...
          </Typography>
        </Box>
        <Box className="w-33 bg-gray-50 p-4 border border-solid border-gray-100 rounded-lg flex flex-col items-center justify-center">
          <ArrowDownwardIcon className="text-red-500 text-3xl mb-2" />
          <Typography className="text-gray-500 mb-2 text-center">
            Week Expense{" "}
          </Typography>
          <Typography variant="h6" className="text-gray-700 text-sm">
            coming...
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        fullWidth
        className="px-8 py-2  text-white bg-blue-700 rounded transition duration-75 ease-in-out hover:bg-green-400 transform mt-6 align-middle justify-center flex mx-auto"
      >
        Add Expense
      </Button>

      <Divider className="my-4" />

      <Typography>Expense History</Typography>
      {transactions &&
        transactions.map(
          (item, index) =>
            item.type === "expense" && (
              <div key={item.id}>
                {index === 0 ||
                moment(item.timestamp).format("DD-MM-YYYY") !==
                  moment(transactions[index - 1].timestamp).format(
                    "DD-MM-YYYY"
                  ) ? (
                  <div className="mt-4 bg-slate-200 text-center">
                    {moment(item.timestamp).format("DD-MM-YYYY")}
                  </div>
                ) : null}
                <TransactionItem
                  transaction={item}
                  onEdit={handleOpenUpdateModal}
                  onDelete={deleteTransaction}
                  Time={moment(item.timestamp).format("hh:mm:ss A")}
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
      />

      <TransactionFormModal
        open={isOpen}
        onClose={handleClose}
        onSubmit={addTransaction}
        initialValues={initialFormValues}
        title="Add New Transaction"
      />
    </Card>
  );
};

export default Home;
