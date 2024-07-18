import React from "react";
import { Box, Typography, Avatar, Stack, IconButton } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
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
        backgroundColor: "rgb(255, 245, 245)",
        marginTop: 2,
        paddingTop: 0,
        paddingBottom: 0,
        display: "flex",
        alignItems: "center",
        border: "1px solid rgb(255, 205, 205)",
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
            backgroundColor: "rgb(255, 105, 105)",
            color: "white",
            width: 32,
            height: 32,
          }}
        >
          {transaction.desc[0]}
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
