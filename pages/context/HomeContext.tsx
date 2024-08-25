/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "universal-cookie";
import {
  showAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  showProfile,
} from "API/api";
import moment from "moment";
import Swal from "sweetalert2";

const defaultContextValue: HomeState = {
  userProfile: null,
  isOpen: false,
  mobileNumber: "",
  transactions: [],
  totalExpense: 0,
  totalIncome: 0,
  totalInvest: 0,
  loading: false,
  setIsOpen: () => {},
  setUpdateModalOpen: () => {},
  updateModalOpen: false,
  fetchTransactions: async () => {},
  addTransaction: async () => {},
  updateTransaction: async () => {},
  deleteTransaction: async () => {},
  fetchProfileData: async () => {},
};

const HomeContext = createContext<HomeState>(defaultContextValue);

interface UserProfile {
  id: string;
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
}

interface TransactionFormValues {
  type: "expense" | "income" | "invest";
  desc: string;
  amount: number;
  timestamp: string | Date;
  mobileNumber: string;
}

interface Transaction {
  id?: string;
  type: "expense" | "income" | "invest";
  desc: string;
  amount: number;
  timestamp: string | Date;
  mobileNumber: string;
}

interface HomeState {
  userProfile: UserProfile | null;
  isOpen: boolean;
  mobileNumber: string;
  transactions: Transaction[];
  totalExpense: number;
  totalIncome: number;
  totalInvest: number;
  loading: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateModalOpen: boolean;
  fetchTransactions: () => Promise<void>;
  addTransaction: (formValues: TransactionFormValues) => Promise<void>;
  updateTransaction: (
    formValues: TransactionFormValues & { id: string }
  ) => Promise<void>;
  deleteTransaction: (record: { id: string; amount: number }) => Promise<void>;
  fetchProfileData: () => Promise<void>;
}

export const HomeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalInvest, setTotalInvest] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState<string>("");

  useEffect(() => {
    const cookies = new Cookies();
    const mobile = cookies.get("mobileNumber") as string;
    if (mobile) {
      setMobileNumber(mobile);
    }

    fetchTransactions();
    fetchProfileData();
  }, [mobileNumber]); // Added mobileNumber as a dependency to ensure it updates correctly

  const fetchProfileData = async () => {
    try {
      const cookies = new Cookies();
      const userId = cookies.get("UserId");
      const response = await showProfile(userId);
      if (response && response.user) {
        setUserProfile(response.user);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const transactionsData = await showAllExpenses();
      const sortedTransactions = transactionsData.data.sort(
        (a: any, b: any) =>
          moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf()
      );

      const normalizedMobileNumber = mobileNumber; // Simplified mobileNumber normalization
      const filteredTransactions = sortedTransactions.filter(
        (item: { mobileNumber: string }) =>
          item.mobileNumber === normalizedMobileNumber
      );

      const formattedTransactions: Transaction[] = filteredTransactions.map(
        (item: any) => ({
          id: item._id,
          type: item.type.toLowerCase() as Transaction["type"],
          desc: item.desc,
          amount: parseFloat(item.amount),
          timestamp: item.timestamp,
          mobileNumber: item.mobileNumber,
        })
      );

      // Calculating totals
      const totals = formattedTransactions.reduce(
        (acc, item) => {
          if (item.type === "expense") acc.expense += item.amount;
          if (item.type === "income") acc.income += item.amount;
          if (item.type === "invest") acc.invest += item.amount;
          return acc;
        },
        { expense: 0, income: 0, invest: 0 }
      );

      setTotalExpense(totals.expense);
      setTotalIncome(totals.income);
      setTotalInvest(totals.invest);
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (formValues: TransactionFormValues) => {
    try {
      await addExpense(formValues);
      fetchTransactions();
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const updateTransaction = async (
    formValues: TransactionFormValues & { id: string }
  ) => {
    try {
      await updateExpense(formValues.id, formValues);
      setUpdateModalOpen(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const deleteTransaction = async (record: { id: string; amount: number }) => {
    if (!record) return;
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
          await deleteExpense(record.id);
          setTransactions(
            transactions.filter((transaction) => transaction.id !== record.id)
          );
          setTotalExpense((prev) => prev - record.amount);
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

  return (
    <HomeContext.Provider
      value={{
        userProfile,
        transactions,
        isOpen,
        totalExpense,
        totalIncome,
        totalInvest,
        loading,
        mobileNumber,
        setUpdateModalOpen,
        updateModalOpen,
        setIsOpen,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        fetchProfileData,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export default function useHome(): HomeState {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
}
