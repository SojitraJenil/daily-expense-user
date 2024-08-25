/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
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
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
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
  const [profileName, setUserProfileName] = useAtom(userProfileName);
  const [userProfileMobileNumber, setUserProfileMobileNumber] = useState("");
  const [, setUserGraphExpense] = useAtom(userGraphExpense);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState("");

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const data = [
    { name: "Expense", value: totalExpense },
    { name: "Income", value: totalIncome },
    { name: "Invest", value: totalInvest },
  ];

  useEffect(() => {
    const now = new Date();
    const formattedDateTime = `${now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}, ${now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    setCurrentDateTime(formattedDateTime);
  }, []);

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
        setUserProfileMobileNumber(response.user.mobileNumber);
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

  const deleteTransaction = async (record: any | undefined) => {
    if (!record) return; // Handle the case where id might be undefined
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
          await deleteExpense(record?.id);
          setTransactions(
            transactions.filter((transaction) => transaction.id !== record?.id)
          );
          setTotalExpense(totalExpense - record.amount);
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

  const expenseBoxes = useCallback(() => {
    return (
      <>
        <Box className="w-32 bg-gray-800 p-4 border-2 border-solid border-red-700 rounded-lg flex flex-col items-center justify-center">
          <ArrowUpwardIcon className="text-red-400 text-3xl mb-2" />
          <Typography className="text-gray-300 mb-2 text-center">
            Expense
          </Typography>
          <Typography variant="h6" className="text-white">
            ₹{totalExpense}
          </Typography>
        </Box>
        <Box className="w-32 bg-gray-800 p-4 border-2 border-solid border-green-700 rounded-lg flex flex-col items-center justify-center">
          <ArrowDownwardIcon className="text-green-400 text-3xl mb-2" />
          <Typography className="text-gray-300 mb-2 text-center">
            Income
          </Typography>
          <Typography variant="h6" className="text-white text-sm">
            ₹{totalIncome}
          </Typography>
        </Box>
        <Box className="w-32 bg-gray-800 p-4 border-2 border-solid border-blue-700 rounded-lg flex flex-col items-center justify-center">
          <ArrowDownwardIcon className="text-blue-400 text-3xl mb-2" />
          <Typography className="text-gray-300 mb-2 text-center">
            Invest
          </Typography>
          <Typography variant="h6" className="text-white text-sm">
            ₹{totalInvest}
          </Typography>
        </Box>
      </>
    );
  }, [totalInvest, totalIncome, totalExpense]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
          <p className="text-gray-800">{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {loading ? (
        <Box className="flex justify-center items-center h-full my-[250px]">
          <CircularProgress />
        </Box>
      ) : (
        <Card className="py-2 px-4 border h-[100%] mb-0 border-solid border-gray-700 overflow-hidden bg-[#6c6c6c]">
          <div className="">
            <Box className="mb-5 pt-1 w-full flex justify-between items-center">
              <main className="bg-[#1F2937] rounded-lg shadow-md mt-4 w-[100%] p-2">
                <div className=" bg-[#1F2937] text-gray-300 mb-4">
                  <div className="flex justify-between items-center p-2">
                    <div className="w-35 text-sm">Updated as on:</div>
                    <div className="w-65 text-sm">{currentDateTime}</div>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <div className="text-md">{profileName}</div>
                    <div className="text-md">+91 {userProfileMobileNumber}</div>
                  </div>
                  <div className="flex justify-center items-center9">
                    <Divider className="w-[95%] bg-white text-gray-200" />
                  </div>
                </div>

                <div>
                  <Box
                    sx={{
                      paddingBottom: 2,
                      marginLeft: 2,
                      marginRight: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      color="primary"
                      onClick={handleOpen}
                      className="px-6 w-[45%]  py-1 text-md text-white bg-gradient-to-r from-teal-600 to-purple-700 rounded-lg transition-transform duration-300 ease-in-out hover:from-purple-700 hover:to-teal-600 transform hover:scale-105"
                    >
                      show expense
                    </button>
                    <button
                      color="primary"
                      onClick={handleOpen}
                      className="px-6 w-[45%] py-1 text-sm text-white bg-gradient-to-r from-teal-600 to-purple-700 rounded-lg transition-transform duration-300 ease-in-out hover:from-purple-700 hover:to-teal-600 transform hover:scale-105"
                    >
                      Add Expense
                    </button>
                  </Box>
                </div>
              </main>
            </Box>
            <Box className="mb-5 pt-1 w-full flex justify-between items-center gap-4">
              {expenseBoxes()}
            </Box>
            <Box className="mb-2 w-full flex justify-between items-center gap-2">
              <div className="w-full h-64 md:h-96">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="80%"
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      {data.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={
                        <CustomTooltip
                          active={undefined}
                          payload={undefined}
                          label={undefined}
                        />
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Box>
          </div>
          <Divider className="my-4 border-gray-700" />
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
                        <div className="bg-gradient-to-r from-teal-600 to-purple-700 rounded-lg transition-transform duration-300 ease-in-out text-white font-bold text-lg text-center py-3 px-6 ">
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
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
