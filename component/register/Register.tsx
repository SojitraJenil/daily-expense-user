import React, { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import Link from "next/link";
import { registerData } from "API/api";
import { useAtom } from "jotai";

interface FormValues {
  name: string;
  mobileNumber: string;
  password: string;
  email: string;
}

interface Errors {
  name?: string;
  mobileNumber?: string;
  password?: string;
  email?: string;
  success?: string;
}

const Register: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    mobileNumber: "",
    password: "",
    email: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loader, setLoader] = useState<boolean>(false);
  const router = useRouter();

  const validateForm = (): Errors => {
    const errors: Errors = {};

    if (!formValues.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formValues.email.trim()) {
      errors.email = "Email is required";
    }

    if (!formValues.mobileNumber.trim()) {
      errors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formValues.mobileNumber)) {
      errors.mobileNumber = "Mobile number must be 10 digits";
    }

    if (!formValues.password.trim()) {
      errors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoader(true);
    event.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoader(true);
      const response = await registerData(
        formValues.name,
        formValues.email,
        formValues.mobileNumber,
        formValues.password
      );
      if (response.status == 201) {
        setErrors({ success: response.data.message });
        const cookies = new Cookies();
        const expires = new Date();
        expires.setMonth(expires.getMonth() + 12);
        cookies.set("userName", formValues.name, { expires: expires });
        cookies.set("token", response.data.token, { expires: expires });
        cookies.set("UserId", response.data.user._id, { expires: expires });
        cookies.set("mobileNumber", formValues.mobileNumber, {
          expires: expires,
        });
        router.push("/landing");
      } else {
        setErrors({ mobileNumber: "Mobile number is already registered" });
        alert(response);
      }
    } catch (error: any) {
      console.error("Error: ", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div
        className="flex max-w-4xl w-full bg-white shadow-md overflow-hidden sm:rounded-lg"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
        }}
      >
        <div
          className="hidden md:flex w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://imgs.search.brave.com/bk-wMRBLPlJbEglNfU8gpmAGzSSBbdXxMUn3bizXZoM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ1/ODEwMDgwMS9waG90/by9maW5hbmNpYWwt/c3VydmVpbGxhbmNl/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1sNXBqdzF3Y3N6/UmpBeExVaExYc0pC/TEpyTFphbzVSS0t3/dUdPdEowSDg4PQ')",
          }}
        ></div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Register
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formValues.name}
                onChange={handleChange}
                className="mt-1 p-2 text-black block w-full border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your Name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formValues.email}
                onChange={handleChange}
                className="mt-1 p-2 text-black block w-full border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your Email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobileNumber"
                value={formValues.mobileNumber}
                onChange={handleChange}
                maxLength={10}
                className="mt-1 p-2 text-black block w-full border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your Mobile Number"
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mobileNumber}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formValues.password}
                onChange={handleChange}
                className="mt-1 text-black p-2 block w-full border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={loader}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loader ? (
                  <div
                    className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                  ></div>
                ) : (
                  "Register"
                )}
              </button>
            </div>
            <p className="text-green-600">{errors.success}</p>
          </form>
          <hr className="text-gray-100 my-4" />
          <Link className={`link`} href="/login">
            Already Registred?{" "}
            <span
              style={{
                color: "blue",
              }}
            >
              Click here to Login
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
