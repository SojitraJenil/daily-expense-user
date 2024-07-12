import React from "react";
import { Box, Typography, Avatar, Stack } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

interface TransactionItemProps {
  transaction: any;
  onEdit: (transaction: any) => void;
  onDelete: (id: string | undefined) => void;
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

  return (
    <div>
      <Box
        key={transaction.id}
        className="bg-red-50 mt-2 flex justify-between items-center border border-red-100 p-1 shadow-md rounded-md"
      >
        <Stack direction="row" className="items-center justify-center">
          <Avatar className="bg-red-400 text-white w-8 h-8 rounded-lg uppercase">
            {transaction.desc[0]}
          </Avatar>
        </Stack>
        <Typography variant="body1" className="justify-around w-full flex">
          <div>{transaction.desc}</div>
          <div>
            <span>{transaction.amount}₹</span>
          </div>
          <div>
            <span className="text-[12px]">{formattedTime}</span>
          </div>
          <div className="flex">
            <div
              className="pe-2 cursor-pointer"
              onClick={() => onEdit(transaction)}
            >
              <CreateIcon />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => onDelete(transaction.id)}
            >
              <DeleteIcon />
            </div>
          </div>
        </Typography>
      </Box>
    </div>
  );
};

export default TransactionItem;
