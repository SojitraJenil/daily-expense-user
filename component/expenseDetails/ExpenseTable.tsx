// import React, { useEffect, useState } from "react";
// import { Box, Typography, Avatar, Stack, CircularProgress } from "@mui/material";
// import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
// import { db } from "../../firebase";

// interface Transaction {
//     [x: string]: unknown;
//     id: string | any;
//     type: "expense" | "income";
//     desc: string;
//     amount: any;
//     timestamp: any;
// }

// const ExpenseComp = () => {
//     const [transactions, setTransactions] = useState<Transaction[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchTransactions = async () => {
//             try {
//                 const querySnapshot = await getDocs(collection(db, "transactions"));

//                 const transactionsData: Transaction[] = [];
//                 querySnapshot.forEach((doc) => {
//                     transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
//                 });
//                 setTransactions(transactionsData);
//             } catch (error) {
//                 console.error("Error fetching transactions:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTransactions();
//     }, []);

//     if (loading) {
//         return (
//             <Box className="flex justify-center items-center h-full">
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
// <Box className="flex-1 w-full lg:w-auto bg-white mr-4 mt-10 p-5 pb-4 border border-gray-50 rounded-lg">
//     {transactions.map((t) => {
//         return (
//             t.type === "expense" && (
//                 <Box
//                     key={t.id}
//                     className="bg-red-50 mt-4 flex justify-between items-center border border-red-100 p-4 shadow-md rounded-md"
//                 >
//                     <Stack direction="row" className="items-center justify-center">
//                         <Avatar className="bg-red-400 text-white w-8 h-8 rounded-lg">
//                             {t.desc[0]}
//                         </Avatar>
//                         <Typography variant="body1" className="ml-3 font-bold text-gray-700">
//                             {t.desc}
//                         </Typography>
//                     </Stack>
//                     <Typography variant="body1">$ {t.amount}</Typography>
//                 </Box>
//             )
//         );
//     })}
// </Box>
// );
// };

// export default ExpenseComp;