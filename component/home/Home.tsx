import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Cookies from "universal-cookie";
import TransactionFormModal from "component/TransactionFormModal/TransactionFormModal";
import dynamic from "next/dynamic";
import useHome from "context/HomeContext";
import DashboardSkeleton from "component/skeleton/HomeSkeleton";

interface Transaction {
  id?: string;
  type: "expense" | "income";
  desc: string;
  amount: number;
  timestamp: any;
  mobileNumber: string;
}

const Home: React.FC = () => {
  const {
    totalExpense,
    totalIncome,
    totalInvest,
    loading,
    isOpen,
    setIsOpen,
    setUpdateModalOpen,
    updateModalOpen,
    userProfile,
    fetchTransactions,
    addTransaction,
  } = useHome();

  const cookies = new Cookies();
  const authToken = cookies.get("token");
  const mobileNumber = cookies.get("mobileNumber");

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

  useEffect(() => {
    fetchTransactions();
  }, [authToken, mobileNumber]);

  const expenseBoxes = useCallback(() => {
    return (
      <>
        <Box className="w-32 bg-gray-800 p-4 border-2 border-solid border-red-700 rounded-lg flex flex-col items-center justify-center">
          <ArrowUpwardIcon className="text-red-400 text-3xl mb-2" />
          <Typography className="text-gray-300 mb-2 text-center">
            Expense
          </Typography>
          <Typography variant="h6" className="text-white">
            {`₹${totalExpense}`}
          </Typography>
        </Box>
        <Box className="w-32 bg-gray-800 p-4 border-2 border-solid border-green-700 rounded-lg flex flex-col items-center justify-center">
          <ArrowDownwardIcon className="text-green-400 text-3xl mb-2" />
          <Typography className="text-gray-300 mb-2 text-center">
            Income
          </Typography>
          <Typography variant="h6" className="text-white text-sm">
            {`₹${totalIncome}`}
          </Typography>
        </Box>
        <Box className="w-32 bg-gray-800 p-4 border-2 border-solid border-blue-700 rounded-lg flex flex-col items-center justify-center">
          <ArrowDownwardIcon className="text-blue-400 text-3xl mb-2" />
          <Typography className="text-gray-300 mb-2 text-center">
            Invest
          </Typography>
          <Typography variant="h6" className="text-white text-sm">
            {`₹${totalInvest}`}
          </Typography>
        </Box>
      </>
    );
  }, [totalInvest, totalIncome, totalExpense, loading]);

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
        <Box className="flex justify-center rounded-xl items-center h-full ">
          <DashboardSkeleton />
        </Box>
      ) : (
        <div className="py-2 px-4 h-[100%] mb-0 overflow-hidden">
          <div className="">
            <Box className="mb-5 pt-1 w-full flex justify-between items-center">
              <main className="bg-[#1F2937] rounded-lg mt-4 w-[100%] p-2">
                <div className=" bg-[#1F2937] text-gray-300 mb-4">
                  <div className="flex justify-between items-center p-2">
                    <div className="w-35 text-sm">Updated as on:</div>
                    <div className="w-65 text-sm">{currentDateTime}</div>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <div className="text-md">{userProfile?.name}</div>
                    <div className="text-md">
                      {`+91 ${userProfile?.mobileNumber}`}
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
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
                      className="px-4 w-[45%]  py-2 text-md text-white bg-gradient-to-r from-teal-600 to-purple-700 rounded-lg transition-transform duration-300 ease-in-out hover:from-purple-700 hover:to-teal-600 transform hover:scale-105"
                    >
                      show expense
                    </button>
                    <button
                      color="primary"
                      onClick={handleOpen}
                      className="px-4 w-[45%] py-2 text-sm text-white bg-gradient-to-r from-teal-600 to-purple-700 rounded-lg transition-transform duration-300 ease-in-out hover:from-purple-700 hover:to-teal-600 transform hover:scale-105"
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
          <TransactionFormModal
            open={updateModalOpen}
            onClose={() => {
              setUpdateModalOpen(false);
              setSelectedTransaction(null);
            }}
            initialValues={selectedTransaction || initialFormValues}
            title="Update Transaction"
            type={undefined}
            onSubmit={function (formValues: any): Promise<void> | void {
              throw new Error("Function not implemented.");
            }}
          />

          <TransactionFormModal
            open={isOpen}
            onClose={handleClose}
            initialValues={initialFormValues}
            title="Add Transaction"
            onSubmit={addTransaction}
            type={undefined}
          />
        </div>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});
