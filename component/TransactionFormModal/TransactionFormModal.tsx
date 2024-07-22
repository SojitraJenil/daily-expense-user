import React, { useState, useEffect, useRef } from "react";

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formValues: any) => Promise<void> | void;
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
  const [loader, setLoader] = useState(false);
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
        <button
          onClick={handleSubmit}
          disabled={loader}
          className="bg-blue-500 text-white rounded-md py-2 w-full mb-2"
        >
          {loader ? (
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-gray-200 text-center mx-auto animate-spin dark:text-gray-600 fill-red-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            "Submit"
          )}
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
