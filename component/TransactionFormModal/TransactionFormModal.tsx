import React, { useState } from "react";
import { Box, Typography, Button, TextField, Modal } from "@mui/material";
import { Timestamp } from "firebase/firestore";

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formValues: any) => void;
  initialValues: any;
  title: string;
}

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
}) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formValues);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="p-4 bg-white rounded-md w-96 mx-auto mt-20">
        <Typography variant="h6" className="text-center mb-4">
          {title}
        </Typography>
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
          value={formValues.amount == 0 ? "" : formValues.amount}
          onChange={handleChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          className="mb-2"
        >
          {title}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          fullWidth
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default TransactionFormModal;
