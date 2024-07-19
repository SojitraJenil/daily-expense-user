import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  CircularProgress,
} from "@mui/material";

interface FuelFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formValues: any) => void;
  initialValues: any;
  title: string;
}

const FuelFormModal: React.FC<FuelFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({ Currentkm: "", fuelPrice: "" });

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
    let tempErrors = { Currentkm: "", fuelPrice: "" };
    if (!formValues.Currentkm) {
      tempErrors.Currentkm = "Current Km Field is required.";
    }
    if (!formValues.fuelPrice) {
      tempErrors.fuelPrice = "Amount is required.";
    } else if (isNaN(Number(formValues.fuelPrice))) {
      tempErrors.fuelPrice = "Amount must be a number.";
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
          label="Current KM"
          variant="outlined"
          fullWidth
          className="mb-4"
          name="Currentkm" // Corrected from "KM"
          onChange={handleChange}
          value={formValues.Currentkm == 0 ? "" : formValues.Currentkm} // Corrected from formValues.km
          error={Boolean(errors.Currentkm)}
          helperText={errors.Currentkm}
        />
        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          type="number"
          className="mb-4"
          name="fuelPrice"
          value={formValues.fuelPrice == 0 ? "" : formValues.fuelPrice}
          onChange={handleChange}
          error={Boolean(errors.fuelPrice)}
          helperText={errors.fuelPrice}
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

export default FuelFormModal;
