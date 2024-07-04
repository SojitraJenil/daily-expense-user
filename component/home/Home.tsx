import React, { useState, useEffect } from "react";
import {
    Card,
    Box,
    Typography,
    Button,
    Modal,
    TextField,
    RadioGroup,
    Radio,
    FormControlLabel,
    Divider,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { collection, addDoc, Timestamp, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import moment from "moment";
import { Avatar, Stack, CircularProgress } from "@mui/material";
import Cookies from "universal-cookie";

interface Transaction {
    [x: string]: unknown;
    id: string | any;
    type: "expense" | "income";
    desc: string;
    amount: any;
    timestamp: any;
    mobileNumber: string;
}


const Home: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const cookies = new Cookies();
    const authToken = cookies.get("auth-token");

    const [loading, setLoading] = useState(true);
    const [formValues, setFormValues] = useState<Transaction>({
        type: "expense",
        desc: "",
        amount: 0,
        timestamp: null,
        id: "",
        mobileNumber: authToken?.mobileNumber || "",
    });

    const formatDateTime = (timestamp: any) => {
        if (!timestamp || !timestamp.seconds) {
            return { formattedDate: "", formattedTime: "" };
        }
        const jsDate = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        const formattedDate = moment(jsDate).format("DD-MM-YYYY");
        const formattedTime = moment(jsDate).format("hh:mm A");

        return { formattedDate, formattedTime };
    };

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const addTransaction = async () => {
        try {
            const currentDateTime = new Date();
            const dateTime = formValues.timestamp ? `${formValues.date} ${formValues.time}` : currentDateTime.toISOString();
            const timestamp = Timestamp.fromDate(new Date(dateTime));

            const transaction: Transaction = {
                type: formValues.type,
                desc: formValues.desc,
                amount: parseFloat(formValues.amount),
                timestamp: timestamp,
                id: authToken?.mobileNumber,
                mobileNumber: authToken?.mobileNumber,
            };

            const docRef = await addDoc(collection(db, "transactions"), transaction);
            console.log("Transaction added with ID: ", docRef.id);
            setTransactions([...transactions, { ...transaction, id: docRef.id }]);
            setFormValues({
                type: "expense",
                desc: "",
                amount: 0,
                timestamp: null,
                id: "",
                mobileNumber: authToken?.mobileNumber || "",
            });
            handleClose();
        } catch (error) {
            console.error("Error adding transaction: ", error);
        }
    };


    useEffect(() => {
        const fetchTransactions = async () => {
            if (!authToken?.mobileNumber) {
                setLoading(false);
                return;
            }

            try {
                const q = query(collection(db, "transactions"), where("mobileNumber", "==", authToken.mobileNumber));
                const querySnapshot = await getDocs(q);

                const transactionsData: Transaction[] = [];
                querySnapshot.forEach((doc) => {
                    transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
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

    return (
        <Card className="p-6 border border-solid border-gray-50 overflow-hidden">
            {/* <Typography variant="h6" className="text-gray-700 mb-4">
                Reports
            </Typography> */}
            <Box className="w-full flex flex-col lg:flex-row xl:flex-row justify-center items-center">
                {/* <Box className="flex-1 mt-10 w-full lg:w-300px h-300px flex items-center justify-center">
                    <Graph />
                </Box> */}
                <Box className="flex-1 w-full flex flex-col items-center justify-evenly lg:ml-4">
                    {/* <Typography variant="h5" className="mb-4 text-gray-700">
                        Your Balance $ {balance}
                    </Typography> */}
                    <Box className="w-[100%] lg:w-4/5 xl:w-4/5 bg-gray-50 p-4 mb-4 border border-solid border-gray-100 rounded-lg">
                        <Box className="flex items-center">
                            <ArrowUpwardIcon className="text-green-500 text-3xl mr-4" />
                            <Box>
                                <Typography variant="h5" className="text-gray-700">
                                    {/* $ {totalIncome} */}
                                </Typography>
                                <Typography className="text-gray-500">Total Income</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box className="w-full lg:w-4/5 xl:w-4/5 bg-gray-50 p-4 border border-solid border-gray-100 rounded-lg">
                        <Box className="flex items-center">
                            <ArrowDownwardIcon className="text-red-500 text-3xl mr-4" />
                            <Box>
                                <Typography variant="h5" className="text-gray-700">
                                    {/* $ {totalExpense} */}
                                </Typography>
                                <Typography className="text-gray-500">Total Expense</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                className="mt-6 align-middle justify-center flex bg-black mx-auto"
            >
                Add Transaction
            </Button>
            <Divider className="my-4" />
            <Box className="py-4">
                <Typography>Expense History</Typography>
                {transactions.map((item) => {
                    const { formattedDate, formattedTime } = formatDateTime(item.timestamp);

                    return (
                        item.type === "expense" && (
                            <Box
                                key={item.id} // Ensure item.id is unique
                                className="bg-red-50 mt-4 flex justify-between items-center border border-red-100 p-1 shadow-md rounded-md"
                            >
                                <Stack direction="row" className="items-center justify-center">
                                    <Avatar className="bg-red-400 text-white w-8 h-8 rounded-lg uppercase">
                                        {item.desc[0]}
                                    </Avatar>
                                </Stack>
                                <Typography variant="body1" className="justify-around w-full flex">
                                    <div>
                                        {item.desc}
                                    </div>
                                    <div>
                                        <span>{item.amount}₹</span>
                                    </div>
                                    <div>
                                        <span className="text-[12px]">{formattedTime}  ll {formattedDate}</span>
                                    </div>
                                </Typography>
                            </Box>
                        )
                    );
                })}
            </Box>
            <Modal open={isOpen} onClose={handleClose}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md w-80">
                    <form onSubmit={(e) => { e.preventDefault(); addTransaction(); }}>
                        <Typography variant="h6" className="mb-4">
                            Expense Tracker
                        </Typography>
                        <TextField
                            fullWidth
                            label="Enter description"
                            name="desc"
                            value={formValues.desc}
                            onChange={handleChange}
                            className="mb-4"
                        />
                        <TextField
                            fullWidth
                            label="Enter amount"
                            type="number"
                            name="amount"
                            value={formValues.amount}
                            onChange={handleChange}
                            className="mb-4"
                        />
                        <RadioGroup
                            value={formValues.type}
                            onChange={handleChange}
                            className="mb-4"
                        >
                            <FormControlLabel
                                value="expense"
                                control={<Radio color="error" />}
                                label="Expense"
                            />
                        </RadioGroup>
                        <Divider className="mb-4" />
                        <Box className="flex justify-end">
                            <Button onClick={handleClose} className="mr-2">
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                type="submit"
                            >
                                Add Transaction
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </Card>
    );
};

export default Home;
