import React from "react";
import CustomLoader from "./Loader";

interface ButtonProps {
    onClick: () => void;
    text: string;
    className?: string;
    isLoading?: boolean;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    text,
    className,
    isLoading,
    disabled
}) => {
    return (
        <button
            onClick={onClick}
            className={`tracking-wider bg-[#002395] text-white font-bold text-center rounded-lg shadow-[rgba(176,187,223,1)_0px_2px_0px_0px] py-[11px] text-[15px] hover:bg-blue-800 hover:text-white ${className} ${isLoading && "opacity-50"
                } ${disabled && "disabled"}`}
            disabled={isLoading || disabled}
        >
            {isLoading ? <CustomLoader /> : <span>{text}</span>}
        </button>
    );
};

export default Button;
