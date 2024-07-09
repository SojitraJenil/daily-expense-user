/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
    Card,
    Typography,
    Button,
    Modal,
    TextField,
    CircularProgress,
    Avatar,
    Stack,
    Box,
    Divider
} from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
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
    setDoc
} from "firebase/firestore";
import { db } from "../../firebase";

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
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const cookies = new Cookies();
    const authToken = cookies.get("auth-token");
    const [loading, setLoading] = useState(true);
    const [totalExpense, setTotalExpense] = useState("0");
    const [formValues, setFormValues] = useState<Transaction>({
        type: "expense",
        desc: "",
        amount: 0,
        timestamp: null,
        mobileNumber: authToken?.mobileNumber || "",
    });
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const calculateTotalExpense = () => {
            const total = transactions
                .filter(transaction => transaction.type === "expense")
                .reduce((acc, transaction) => acc + parseFloat(transaction.amount.toString()), 0);
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
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDoc(doc(db, "transactions", id));
                    setTransactions(transactions.filter(transaction => transaction.id !== id));
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error("Error deleting transaction: ", error);
                    Swal.fire({
                        title: "Error",
                        text: "Failed to delete transaction.",
                        icon: "error"
                    });
                }
            }
        });
    };


    const handleOpenUpdateModal = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setFormValues(transaction);
        setUpdateModalOpen(true);
    };

    const addTransaction = async () => {
        try {
            const transaction: Omit<Transaction, 'id'> = {
                type: formValues.type,
                desc: formValues.desc,
                amount: parseFloat(formValues.amount.toString()),
                timestamp: Timestamp.now(), // Use Firebase server timestamp
                mobileNumber: authToken?.mobileNumber || "",
            };
            const docRef = await addDoc(collection(db, "transactions"), transaction);
            setTransactions([...transactions, { ...transaction, id: docRef.id }]);
            setFormValues({
                type: "expense",
                desc: "",
                amount: 0,
                timestamp: null,
                mobileNumber: authToken?.mobileNumber || "",
            });
            handleClose();
        } catch (error) {
            console.error("Error adding transaction: ", error);
        }
    };

    const updateTransaction = async () => {
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

            const updatedTransactions = transactions.map(t => t.id === selectedTransaction.id ? updatedTransaction : t);
            setTransactions(updatedTransactions);
            setUpdateModalOpen(false);
            setSelectedTransaction(null);
            setFormValues({
                type: "expense",
                desc: "",
                amount: 0,
                timestamp: null,
                mobileNumber: authToken?.mobileNumber || "",
            });
        } catch (error) {
            console.error("Error updating transaction: ", error);
        }
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!authToken?.mobileNumber) {
                setLoading(false);
                return;
            }

            try {
                let q = query(collection(db, "transactions"), where("mobileNumber", "==", authToken.mobileNumber));

                const querySnapshot = await getDocs(q);
                const transactionsData: Transaction[] = [];
                querySnapshot.forEach((doc) => {
                    transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
                });

                transactionsData.sort((a, b) => {
                    return moment(b.timestamp.toDate()).valueOf() - moment(a.timestamp.toDate()).valueOf();
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

    if (loading) {
        return (
            <Box className="flex justify-center items-center h-full">
                <CircularProgress />
            </Box>
        );
    }

    const handleClick = () => {
        setFormValues({
            type: "expense",
            desc: "",
            amount: 0,
            timestamp: null,
            mobileNumber: authToken?.mobileNumber || "",
        });
        handleOpen();
    };
    return (
        <Card className="p-6 border border-solid border-gray-50 overflow-hidden">
            <Box className="w-full flex justify-center items-center gap-4">
                <Box className="w-48 bg-gray-50 p-4 border border-solid border-gray-100 rounded-lg flex flex-col items-center justify-center">
                    <ArrowUpwardIcon className="text-green-500 text-3xl mb-2" />
                    <Typography className="text-gray-500 mb-2">Day Expense</Typography>
                    <Typography variant="h6" className="text-gray-700">
                        ₹{totalExpense}
                    </Typography>
                </Box>
                <Box className="w-48 bg-gray-50 p-4 border border-solid border-gray-100 rounded-lg flex flex-col items-center justify-center">
                    <ArrowDownwardIcon className="text-red-500 text-3xl mb-2" />
                    <Typography className="text-gray-500 mb-2">Week Expense </Typography>
                    <Typography variant="h6" className="text-gray-700">
                        ₹{totalExpense}
                    </Typography>
                </Box>
            </Box>


            <Button
                variant="contained"
                color="primary"
                onClick={handleClick}
                fullWidth
                className="px-8 py-2  text-white bg-blue-700 rounded transition duration-75 ease-in-out hover:bg-green-400 transform hover:-translate-y-1 animate-bounce mt-6 align-middle justify-center flex mx-auto"
            >
                Add Expense
            </Button>

            <Divider className="my-4" />

            <Typography>Expense History</Typography>
            {transactions.map((item, index) => {
                const { formattedDate, formattedTime } = formatDateTime(item.timestamp);

                return (
                    item.type === "expense" && (
                        <div key={item.id}>
                            {index === 0 || formattedDate !== formatDateTime(transactions[index - 1].timestamp).formattedDate ? (
                                <>
                                    <div className="mt-4 bg-slate-200 text-center">{formattedDate}</div>
                                </>
                            ) : null}
                            <Box
                                key={item.id}
                                className="bg-red-50 mt-2 flex justify-between items-center border border-red-100 p-1 shadow-md rounded-md"
                            >
                                <Stack direction="row" className="items-center justify-center">
                                    <Avatar className="bg-red-400 text-white w-8 h-8 rounded-lg uppercase">
                                        {item.desc[0]}
                                    </Avatar>
                                </Stack>
                                <Typography variant="body1" className="justify-around w-full flex">
                                    <div>{item.desc}</div>
                                    <div>
                                        <span>{item.amount}₹</span>
                                    </div>
                                    <div>
                                        <span className="text-[12px]">{formattedTime}</span>
                                    </div>
                                    <div className="flex">
                                        <div className="pe-2 cursor-pointer" onClick={() => handleOpenUpdateModal(item)}>
                                            <CreateIcon />
                                        </div>
                                        <div className="cursor-pointer" onClick={() => deleteTransaction(item.id)}>
                                            <DeleteIcon />
                                        </div>
                                    </div>
                                </Typography>
                            </Box>
                        </div>
                    )
                );
            })}
            <Modal
                open={updateModalOpen}
                onClose={() => {
                    setUpdateModalOpen(false);
                    setSelectedTransaction(null);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="p-4 bg-white rounded-md w-96 mx-auto mt-20">
                    <Typography variant="h6" className="text-center mb-4">Update Transaction</Typography>
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        name="desc"
                        value={formValues.desc}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        type="number"
                        className="mb-4"
                        name="amount"
                        value={formValues.amount}
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={updateTransaction}
                        fullWidth
                        className="mb-2"
                    >
                        Update Transaction
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            setUpdateModalOpen(false);
                            setSelectedTransaction(null);
                        }}
                        fullWidth
                    >
                        Cancel
                    </Button>
                </Box>
            </Modal>

            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="p-4 bg-white rounded-md w-96 mx-auto mt-20">
                    <Typography variant="h6" className="text-center mb-4">Add New Transaction</Typography>
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        className="mb-4"
                        name="desc"
                        value={formValues.desc}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        type="number"
                        className="mb-4"
                        name="amount"
                        value={formValues.amount}
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={addTransaction}
                        fullWidth
                        className="mb-2"
                    >
                        Add Transaction
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClose}
                        fullWidth
                    >
                        Cancel
                    </Button>
                </Box>
            </Modal>
        </Card>
    );
};

export default Home;
