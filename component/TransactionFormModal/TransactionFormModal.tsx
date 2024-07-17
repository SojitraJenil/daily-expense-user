import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  CircularProgress,
} from "@mui/material";

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
  const [errors, setErrors] = useState({ desc: "", amount: "" });

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues: any) => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validate = () => {
    let tempErrors = { desc: "", amount: "" };
    if (!formValues.desc) {
      tempErrors.desc = "Description is required.";
    }
    if (!formValues.amount) {
      tempErrors.amount = "Amount is required.";
    } else if (isNaN(Number(formValues.amount))) {
      tempErrors.amount = "Amount must be a number.";
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formValues);
    }
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
          error={Boolean(errors.desc)}
          helperText={errors.desc}
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
          error={Boolean(errors.amount)}
          helperText={errors.amount}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          className="mb-2"
        >
          Submit
          {/* // <CircularProgress size={24} color="inherit" /> */}
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
