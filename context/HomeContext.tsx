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
  addExpense,
  updateExpense,
  deleteExpense,
  showProfile,
  showAllExpensesByNumber,
  showAllExpensesBySearch,
} from "API/api";
import moment from "moment";
import Swal from "sweetalert2";

interface UserProfile {
  [x: string]: string;
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
  userProfile: UserProfile;
  userId: string;
  isOpen: boolean;
  mobileNumber: string;
  token: string;
  transactions: Transaction[];
  totalExpense: number;
  totalIncome: number;
  totalInvest: number;
  loading: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUserProfile: any;
  setUpdateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateModalOpen: boolean;
  deleteLoading: boolean;
  filterStatus: boolean;
  setDeleteLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchTransactions: () => Promise<void>;
  addTransaction: (formValues: TransactionFormValues) => Promise<void>;
  OnSearchRecord: any;
  setFilterStatus: any;
  onBtnFilterRecord: any;
  updateTransaction: (
    formValues: TransactionFormValues & { id: string }
  ) => Promise<void>;
  deleteTransaction: any;
  fetchProfileData: () => Promise<void>;
}

const HomeContext = createContext<HomeState | undefined>(undefined);

export const HomeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const cookies = new Cookies();
  const mobileNumber = cookies.get("mobileNumber") as string;
  const userId = cookies.get("UserId");
  const token = cookies.get("token");
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<boolean>(false);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalInvest, setTotalInvest] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    fetchTransactions();
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const userId = cookies.get("UserId");
    try {
      const response = await showProfile(userId);
      if (response && response.user) {
        setUserProfile(response.user);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const OnSearchRecord = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;

    if (newSearchTerm.length === 0) {
      setFilterStatus(false);
      fetchTransactions();
    } else {
      setFilterStatus(true);
      try {
        const SearchRes = await showAllExpensesBySearch(
          mobileNumber,
          newSearchTerm
        );
        setTransactions(SearchRes.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  const onBtnFilterRecord = (filterType: string) => async () => {
    try {
      const SearchRes = await showAllExpensesBySearch(mobileNumber, filterType);
      setTransactions(SearchRes.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setFilterStatus(true);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const MobileNumber = String(mobileNumber).trim();
      const transactionsData = await showAllExpensesByNumber(MobileNumber);

      const sortedTransactions = transactionsData.data.sort(
        (a: any, b: any) =>
          moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf()
      );
      const filteredTransactions = sortedTransactions.filter(
        (item: { mobileNumber: string }) => transactionsData
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

      const totalExpense = formattedTransactions
        .filter((item) => item.type === "expense")
        .reduce((acc, item) => acc + item.amount, 0);
      const totalIncome = formattedTransactions
        .filter((item) => item.type === "income")
        .reduce((acc, item) => acc + item.amount, 0);
      const totalInvest = formattedTransactions
        .filter((item) => item.type === "invest")
        .reduce((acc, item) => acc + item.amount, 0);

      setTotalExpense(totalExpense);
      setTotalIncome(totalIncome);
      setTotalInvest(totalInvest);
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (formValues: any) => {
    try {
      await addExpense(formValues);
      fetchTransactions();
      setIsOpen(false);
      handleClose();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const updateTransaction = async (formValues: any) => {
    try {
      setDeleteLoading(true);
      await updateExpense(formValues.id, formValues);
      setUpdateModalOpen(false);
      setDeleteLoading(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const deleteTransaction = async (record: any) => {
    if (!record) return;
    Swal.fire({
      title: `Are you sure you want to delete ${record.desc} ₹${record.amount} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleteLoading(true);
        try {
          await deleteExpense(record.id);
          setTransactions(
            transactions.filter((transaction) => transaction.id !== record.id)
          );
          setTotalExpense(totalExpense - record.amount);
        } catch (error) {
          console.error("Error deleting transaction: ", error);
          Swal.fire({
            title: "Error",
            text: "Failed to delete transaction.",
            icon: "error",
          });
        } finally {
          setDeleteLoading(false);
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
        token,
        userId,
        updateModalOpen,
        filterStatus,
        deleteLoading,
        setUpdateModalOpen,
        setFilterStatus,
        setDeleteLoading,
        setUserProfile,
        setIsOpen,
        fetchTransactions,
        addTransaction,
        onBtnFilterRecord,
        updateTransaction,
        deleteTransaction,
        fetchProfileData,
        OnSearchRecord,
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
