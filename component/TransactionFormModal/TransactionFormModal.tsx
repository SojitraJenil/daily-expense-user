import CustomLoader from "component/common/Loader";
import React, { useState, useEffect, useRef } from "react";

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formValues: any) => Promise<void> | void;
  initialValues: any;
  title: string;
  type: any;
}

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({ desc: "", amount: "", type: "" });

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
    let tempErrors = { desc: "", amount: "", type: "" };
    if (!formValues.desc) {
      tempErrors.desc = "Description is required.";
    }
    if (!formValues.amount) {
      tempErrors.amount = "Amount is required.";
    } else if (isNaN(Number(formValues.amount))) {
      tempErrors.amount = "Amount must be a number.";
    }
    if (!formValues.type) {
      tempErrors.type = "Select any one type.";
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = () => {
    if (validate()) {
      setLoader(true);
      Promise.resolve(onSubmit(formValues))
        .then(() => setLoader(false))
        .catch(() => setLoader(false));
    }
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
      <div ref={modalRef} className="bg-white rounded-lg p-6 w-96 z-10">
        <h2 className="text-center text-lg font-bold mb-4">{title}</h2>
        <div className="mb-2">
          <label className="block text-black">Description</label>
          <input
            type="text"
            name="desc"
            value={formValues.desc}
            onChange={handleChange}
            className="mt-1 py-2 ps-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
          {errors.desc && (
            <p className="text-red-500 text-sm mt-1">{errors.desc}</p>
          )}
        </div>
        <div className="my-1 mb-3">
          <label className="block text-black">Amount</label>
          <input
            type="number"
            name="amount"
            value={formValues.amount == 0 ? "" : formValues.amount}
            onChange={handleChange}
            className="mt-1 py-2 ps-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>
        <div className="my-2">
          <div className="flex items-center">
            <input
              type="radio"
              value="expense"
              className="mr-2 h-4 w-4"
              name="type"
              id="expense"
              checked={formValues.type === "expense"}
              onChange={handleChange}
            />
            <label htmlFor="expense" className="align-middle">
              Expense
            </label>
          </div>
          <div className="flex items-center pt-1">
            <input
              type="radio"
              value="income"
              className="mr-2 h-4 w-4"
              name="type"
              id="income"
              checked={formValues.type === "income"}
              onChange={handleChange}
            />
            <label htmlFor="income" className="align-middle">
              Income
            </label>
          </div>
          <div className="flex items-center py-1 pb-2">
            <input
              type="radio"
              value="invest"
              className="mr-2 h-4 w-4"
              name="type"
              id="invest"
              checked={formValues.type === "invest"}
              onChange={handleChange}
            />
            <label htmlFor="invest" className="align-middle">
              Invest
            </label>
          </div>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loader}
          className="bg-blue-500 text-white rounded-md py-2 w-full mb-2"
        >
          {loader ? <CustomLoader /> : "Submit"}
        </button>
        <button
          onClick={onClose}
          disabled={loader}
          className="border border-gray-300 rounded-md py-2 w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TransactionFormModal;
