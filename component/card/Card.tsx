import React from "react";
import { Card as MuiCard, CardProps } from "@mui/material";

const Card: React.FC<CardProps> = ({ children, ...rest }) => {
    return (
        <MuiCard
            className="mt-9 p-6 border border-solid border-gray-50 overflow-hidden rounded-lg bg-white"
            {...rest}
        >
            {children}
        </MuiCard>
    );
};

export default Card;