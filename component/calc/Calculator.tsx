/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FuelFormModal from "component/FuelFormModal/FuelFormModal";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  addFuelDetails,
  deleteFuelDetails,
  showAllFuelDetails,
  updateFuelDetails,
} from "API/api";
import Cookies from "universal-cookie";
import moment from "moment";
import Swal from "sweetalert2";
import { average } from "firebase/firestore";

function Calculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [CurrentPrice, setCurrentPrice] = useState("");
  const [fuelRecord, setFuelRecord] = useState<any>();
  const [selectedFuel, setSelectedFuel] = useState<any>(null);
  const cookies = new Cookies();
  const mobileNumber = cookies.get("mobileNumber");
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setIsEditOpen(false);
  };
  const initialFormValues = {
    Currentkm: 0,
    fuelPrice: 0,
    mobileNumber: mobileNumber,
  };

  const addFuelRecord = async (formValues: any) => {
    try {
      await addFuelDetails(formValues);
      ShowFuelRecord();
      handleClose();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const editFuelRecord = async (formValues: any) => {
    try {
      await updateFuelDetails(selectedFuel._id, formValues);
      ShowFuelRecord();
      handleClose();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  useEffect(() => {
    console.log("Fuel", "=======================================>");
    ShowFuelRecord();
  }, []);

  const ShowFuelRecord = async () => {
    setLoading(true);
    try {
      const response = await showAllFuelDetails();
      const normalizedMobileNumber = String(mobileNumber).trim();
      const fuelRecords = response.data;
      const matchingRecords = fuelRecords.filter(
        (item: any) =>
          String(item.mobileNumber).trim() === normalizedMobileNumber
      );
      setFuelRecord(matchingRecords);
      handleClose();
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    Swal.fire({
      title: "Are you sure you want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteFuelDetails(id);
          ShowFuelRecord();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting transaction: ", error);
          Swal.fire({
            title: "Error",
            text: "Failed to delete transaction.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleEditClick = (fuel: any) => {
    setSelectedFuel(fuel);
    setIsEditOpen(true);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-full my-[250px]">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="bg-white h-screen">
      <div className="flex py-3 pt-8 justify-evenly items-center gap-4 ">
        <div className="w-[200px] h-[150px] bg-gray-50 p-4 border border-solid border-gray-100 rounded-lg flex flex-col items-center justify-center">
          <Typography className="text-gray-500 mb-2 text-center">
            Average
          </Typography>
          <Typography variant="h6" className="text-gray-700">
            100
          </Typography>
        </div>
        <div className="w-[200px] h-[150px] bg-gray-50 p-4 border border-solid border-gray-100 rounded-lg flex flex-col items-center justify-center">
          <Typography className="text-gray-500 mb-2 text-center">
            Average
          </Typography>
          <Typography variant="h6" className="text-gray-700 text-center">
            100
          </Typography>
        </div>
      </div>
      <div className="text-center">
        <Button
          variant="contained"
          color="info"
          onClick={handleOpen}
          className="mx-2 px-10 py-2 text-white bg-blue-500 rounded transition duration-75 ease-in-out hover:bg-green-400 transform mt-6 align-middle justify-center"
        >
          Add Expense
        </Button>
      </div>
      <hr className="mt-2 bg-black" />
      <p className="text-black text-[19px] ms-5 mt-2">Fuel Records</p>
      {fuelRecord &&
        fuelRecord.reverse().map((item: any, index: number) => {
          return (
            <React.Fragment key={item._id}>
              {index === 0 ||
              moment(item.timestamp).format("DD-MM-YYYY") !==
                moment(fuelRecord[index - 1].timestamp).format("DD-MM-YYYY") ? (
                <div className="mt-4 bg-slate-500 text-white text-center mx-4 rounded-sm">
                  {moment(item.timestamp).format("DD-MM-YYYY")}
                </div>
              ) : null}
              <Box
                className={"bg-red-100 py-1"}
                sx={{
                  marginLeft: 2,
                  marginRight: 2,
                  marginTop: 2,
                  paddingTop: 0,
                  paddingBottom: 0,
                  alignItems: "center",
                  border: "1px solid rgb(255, 255, 255)",
                  boxShadow: 1,
                  justifyContent: "space-between",
                  borderRadius: 1,
                }}
              >
                <Stack
                  direction="row"
                  paddingLeft={0.5}
                  alignItems="center"
                  spacing={1}
                  justifyContent={"space-evenly"}
                >
                  <Typography variant="body1">{index + 1}</Typography>
                  <Typography variant="body1">{item?.Currentkm}-KM</Typography>
                  <Typography variant="body1">₹{item?.fuelPrice}</Typography>
                  <Typography variant="body1">
                    {moment(item.timestamp).format("hh:mm:ss A")}
                  </Typography>
                  <IconButton
                    onClick={() => handleEditClick(item)}
                    className="p-0 m-0"
                  >
                    <CreateIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(item._id)}
                    className="p-0 m-0"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Stack>
                  <Typography
                    variant="body2"
                    className="pr-1"
                    sx={{ color: "gray", fontSize: "0.75rem" }}
                  >
                    {/* {Time} */}
                  </Typography>
                </Stack>
              </Box>
            </React.Fragment>
          );
        })}

      <FuelFormModal
        open={isOpen}
        onClose={handleClose}
        onSubmit={addFuelRecord}
        initialValues={initialFormValues}
        title="Add Fuel Details"
      />

      {selectedFuel && (
        <FuelFormModal
          open={isEditOpen}
          onClose={handleClose}
          onSubmit={editFuelRecord}
          initialValues={selectedFuel}
          title="Edit Fuel Details"
        />
      )}
    </div>
  );
}

export default Calculator;
