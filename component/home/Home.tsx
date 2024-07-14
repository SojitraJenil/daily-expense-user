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
import Swal from "sweetalert2";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import TransactionItem from "component/TransactionItem/TransactionItem";
import TransactionFormModal from "component/TransactionFormModal/TransactionFormModal";
import { useAtom, useAtomValue } from "jotai";
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
  const [, setUsers] = useAtom(userAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const cookies = new Cookies();
  const authToken = cookies.get("token");
  const [loading, setLoading] = useState(false);
  const [totalExpense, setTotalExpense] = useState("0");
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const initialFormValues = {
    type: "expense",
    desc: "",
    amount: 0,
    timestamp: null,
    mobileNumber: authToken?.mobileNumber || "",
  };

  const formatDateTime = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) {
      return { formattedDate: "", formattedTime: "" };
    }
    const jsDate = new Date(timestamp.seconds * 1000);
    const formattedDate = moment(jsDate).format("DD-MM-YYYY");
    const formattedTime = moment(jsDate).format("hh:mm A");
    return { formattedDate, formattedTime };
  };
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setSelectedTransaction(null);
  };

  useEffect(() => {
    const calculateTotalExpense = () => {
      const total = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce(
          (acc, transaction) => acc + parseFloat(transaction.amount.toString()),
          0
        );
      setTotalExpense(total.toFixed(2));
    };

    calculateTotalExpense();
  }, [transactions]);

  const deleteTransaction = (id: string | undefined) => {
    if (!id) {
      console.error("Invalid transaction ID:", id);
      return;
    }

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
          await deleteDoc(doc(db, "transactions", id));
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

  const handleOpenUpdateModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setUpdateModalOpen(true);
  };

  const addTransaction = async (formValues: any) => {
    try {
      const transaction: Omit<Transaction, "id"> = {
        ...formValues,
        amount: parseFloat(formValues.amount.toString()),
        timestamp: Timestamp.now(), // Use Firebase server timestamp
      };
      const docRef = await addDoc(collection(db, "transactions"), transaction);
      setTransactions([...transactions, { ...transaction, id: docRef.id }]);
      handleClose();
    } catch (error) {
      console.error("Error adding transaction: ", error);
    }
  };

  const updateTransaction = async (formValues: any) => {
    if (!selectedTransaction) return;

    try {
      const transactionRef = doc(db, "transactions", selectedTransaction.id!);
      const updatedTransaction = {
        ...selectedTransaction,
        ...formValues,
        amount: parseFloat(formValues.amount.toString()),
        timestamp: Timestamp.now(),
      };
      await setDoc(transactionRef, updatedTransaction);

      const updatedTransactions = transactions.map((t) =>
        t.id === selectedTransaction.id ? updatedTransaction : t
      );
      setTransactions(updatedTransactions);
      setUpdateModalOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error("Error updating transaction: ", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchTransactions = async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }

      try {
        let q = query(
          collection(db, "transactions"),
          where("mobileNumber", "==", authToken)
        );

        const querySnapshot = await getDocs(q);
        const transactionsData: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
        });

        transactionsData.sort((a, b) => {
          return (
            moment(b.timestamp.toDate()).valueOf() -
            moment(a.timestamp.toDate()).valueOf()
          );
        });

        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedUsers: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, ...doc.data() });
        });
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, [setUsers]);

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
          <Typography variant="h6" className="text-gray-700">
            ₹{totalExpense}
          </Typography>
        </Box>
        <Box className="w-33 bg-gray-50 p-4 border border-solid border-gray-100 rounded-lg flex flex-col items-center justify-center">
          <ArrowDownwardIcon className="text-red-500 text-3xl mb-2" />
          <Typography className="text-gray-500 mb-2 text-center">
            Week Expense{" "}
          </Typography>
          <Typography variant="h6" className="text-gray-700">
            ₹{totalExpense}
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
      {transactions.map(
        (item, index) =>
          item.type === "expense" && (
            <div key={item.id}>
              {index === 0 ||
              formatDateTime(item.timestamp).formattedDate !==
                formatDateTime(transactions[index - 1].timestamp)
                  .formattedDate ? (
                <div className="mt-4 bg-slate-200 text-center">
                  {formatDateTime(item.timestamp).formattedDate}
                </div>
              ) : null}
              <TransactionItem
                transaction={item}
                onEdit={handleOpenUpdateModal}
                onDelete={deleteTransaction}
                formatDateTime={formatDateTime}
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
