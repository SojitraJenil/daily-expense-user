import React from "react";
import { Box, Typography, Avatar, Stack, IconButton } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";

interface TransactionItemProps {
  transaction: any;
  Time: any;
  onEdit: (transaction: any) => void;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete,
  Time,
}) => {
  const handleEditClick = () => {
    onEdit(transaction);
  };

  const handleDeleteClick = () => {
    onDelete(transaction.id);
  };

  return (
    <Box
      key={transaction.id}
      sx={{
        backgroundColor:
          transaction.type === "income"
            ? "rgb(240, 255, 240)"
            : transaction.type === "expense"
            ? "rgb(255, 245, 250)"
            : transaction.type === "invest"
            ? "#e6eefc"
            : undefined,
        marginTop: 1,
        paddingTop: 0,
        paddingBottom: 0,
        display: "flex",
        alignItems: "center",
        border: "1px solid",
        borderColor:
          transaction.type === "invest"
            ? "#7192c7"
            : transaction.type === "income"
            ? "rgb(200, 255, 200)"
            : transaction.type === "expense"
            ? "#c8d3e8"
            : undefined,
        boxShadow: 1,
        borderRadius: 1,
      }}
    >
      <Stack
        direction="row"
        paddingLeft={0.5}
        alignItems="center"
        spacing={1}
        sx={{ flex: 1 }}
      >
        <Avatar
          sx={{
            backgroundColor:
              transaction.type === "income"
                ? "green"
                : transaction.type === "expense"
                ? "red"
                : transaction.type === "invest"
                ? "blue"
                : undefined,
            color: "black",
            width: 32,
            height: 32,
          }}
        >
          {transaction.type === "income" ? (
            <ArrowUpwardIcon className="text-transparent text-3xl" />
          ) : transaction.type === "expense" ? (
            <ArrowDownwardIcon className="text-transparent text-3xl" />
          ) : (
            <ArrowDownwardIcon className="text-transparent text-3xl" />
          )}
        </Avatar>

        <Typography variant="body1" sx={{ flex: 1 }}>
          {transaction.desc}
        </Typography>
        <Typography variant="body1">₹{transaction.amount}</Typography>
        <IconButton onClick={handleEditClick} className="p-0 m-0">
          <CreateIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={handleDeleteClick} className="p-0 m-0">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Stack>
        <Typography
          variant="body2"
          className="pr-1"
          sx={{ color: "gray", fontSize: "0.75rem" }}
        >
          {Time}
        </Typography>
      </Stack>
    </Box>
  );
};

export default TransactionItem;
