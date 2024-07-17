import React from "react";
import { Box, Typography, Avatar, Stack, IconButton } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

interface TransactionItemProps {
  transaction: any;
  onEdit: (transaction: any) => void;
  onDelete: any;
  formatDateTime: (timestamp: any) => {
    formattedDate: string;
    formattedTime: string;
  };
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete,
  formatDateTime,
}) => {
  const { formattedDate, formattedTime } = formatDateTime(
    transaction.timestamp
  );

  const handleEditClick = () => {
    onEdit(transaction);
  };

  const handleDeleteClick = () => {
    onDelete(transaction.id);
  };

  return (
    <Box
      key={transaction.id}
      className="bg-red-50 mt-2 p-2 sm:p-3 flex flex-col sm:flex-row justify-between items-center border border-red-100 shadow-md rounded-md"
    >
      <Stack direction="row" alignItems="center" spacing={2} className="flex-1">
        <Avatar className="bg-red-400 text-white w-8 h-8 rounded-lg uppercase">
          {transaction.desc[0]}
        </Avatar>
        <Typography variant="body1" className="flex-1">
          {transaction.desc}
        </Typography>
        <Typography variant="body1">₹{transaction.amount}</Typography>
        <Typography variant="body1" className="">
          {transaction.mobileNumber}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" className="text-gray-500 text-xs">
          {formattedTime}
        </Typography>
        <IconButton onClick={handleEditClick}>
          <CreateIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default TransactionItem;
