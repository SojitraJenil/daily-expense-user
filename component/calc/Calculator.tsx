import { Typography } from "@mui/material";
import React from "react";

function Calculator() {
  return (
    <div className="">
      <h3 className="text-center text-lg font-bold">Fuel Details</h3>
      <div className="bg-red-200 mt-2 flex justify-between items-center border border-red-100 p-1 shadow-md rounded-md">
        <Typography variant="body1" className="justify-around w-full flex">
          <div>Date</div>
          <div>
            <span>Amount</span>
          </div>
        </Typography>
      </div>
      <div className="bg-red-50 mt-2 flex justify-between items-center border border-red-100 p-1 shadow-md rounded-md">
        <Typography variant="body1" className="justify-around w-full flex">
          <div>12-12-1212</div>
          <div>
            <span>500₹</span>
          </div>
        </Typography>
      </div>
    </div>
  );
}

export default Calculator;
