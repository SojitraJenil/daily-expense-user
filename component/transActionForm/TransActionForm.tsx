import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Graph from "component/graph/Graph";
import TransActionForm from "./TransActionForm";

interface Transaction {
    type: string;
    desc: string;
    amount: number;
}

const Home: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    console.log(isOpen);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const addTransAction = (transaction: Transaction) => {
        setTransactions([...transactions, transaction]);
        handleClose();
    };

    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = totalIncome - totalExpense;

    return (
        <Card>
            <Typography variant="h6" className="text-gray-700 mb-4 px-5">
                Reports
            </Typography>
            <Box className=" w-full flex flex-col lg:flex-row xl:flex-row justify-center items-center">
                <Box className="flex-1 mt-10 w-full lg:w-300px h-300px flex items-center justify-center">
                    <Graph />
                </Box>
                <Box className="flex-1 w-full flex flex-col items-center justify-evenly lg:ml-4">
                    <Typography variant="h5" className="mb-4 text-gray-700">
                        Your Balance $ {balance}
                    </Typography>
                    <Box className="w-full lg:w-4/5 xl:w-4/5 bg-gray-50 p-4 mb-4 border border-solid border-gray-100 rounded-lg">
                        <Box className="flex items-center">
                            <ArrowUpwardIcon className="text-green-500 text-3xl mr-4" />
                            <Box>
                                <Typography variant="h5" className="text-gray-700">
                                    $ {totalIncome}
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
                                    $ {totalExpense}
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
                className="mt-6"
            >
                Add Transaction
            </Button>
        </Card>
    );
};

export default Home;