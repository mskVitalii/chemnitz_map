import API from "@app/api/api";
import UserLogin from "@app/components/Containers/UserLogin";
import { IUserData } from "@app/interfaces/user";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon
} from "@heroicons/react/20/solid";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

function RegistrationPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup
      .string()
      .min(8, "Password must be 8 characters long")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter")
      .matches(/[_\W]/, "Password requires a symbol")
      .required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required()
  });

  const handleShowClick = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const registerData: IUserData = {
        email: values.email,
        password: values.password,
        favourites: [],
        homes: [],
        status: "active",
        userType: "regular"
      };

      await API.user
        .create(registerData)
        .then(() => {
          navigate("/login");
        })
        .catch((err) => {
          toast.error(`${err}`);
        });
    }
  });

  return (
    <UserLogin title="Registration">
      <div className="pt-5 flex justify-center mb-5 mt-[-5px]">
        <p className="text-slate-600 text-base font-normal line-clamp-3">
          Already have an account?
        </p>
        <Link to="/login">
          <p className="ml-2 text-cyan-600 text-base line-clamp-3 font-semibold">
            Log in
          </p>
        </Link>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-5 p-8 rounded-md shadow-md bg-slate-50">
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <EnvelopeIcon className="text-gray-400 w-4 h-4" />
              </div>
              <input
                type="text"
                className={`bg-slate-100 border border-gray-300 ${
                  formik.errors.email ? "bg-red-50 border-red-500 " : ""
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full ps-10 p-2.5 autofill:shadow-none`}
                placeholder="email"
                {...formik.getFieldProps("email")}
              />
            </div>
            <div className="form-error-message text-red-600 mt-1">
              {formik.errors.email}
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <LockClosedIcon className="text-gray-400 w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className={`bg-slate-100 border border-gray-300 ${
                  formik.errors.password ? "bg-red-50 border-red-500 " : ""
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full ps-10 p-2.5 autofill:bg-slate-100 autofill:text-gray-900`}
                placeholder="Password"
                {...formik.getFieldProps("password")}
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center text-sm leading-5">
                <button
                  type="button"
                  className="icon-button text-gray-600 bg-blue-600 hover:bg-blue-500 focus:outline-none"
                  onClick={handleShowClick}
                  aria-label="Show password"
                >
                  {!showPassword ? (
                    <EyeSlashIcon className="w-3 h-3 text-white" />
                  ) : (
                    <EyeIcon className="w-3 h-3 text-white" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <p className="text-slate-600 font-normal text-sm px-1 pt-0.5 line-clamp-3">
                Min 8 characters, lowercase, uppercase letters and symbols
              </p>
            </div>
            <div className="form-error-message text-red-600 mt-1">
              {formik.errors.password}
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <LockClosedIcon className="text-gray-400 w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className={`bg-slate-100 border border-gray-300 ${
                  formik.errors.password ? "bg-red-50 border-red-500" : ""
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full ps-10 p-2.5`}
                placeholder="Confirm password"
                {...formik.getFieldProps("confirmPassword")}
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center text-sm leading-5">
                <button
                  type="button"
                  className="icon-button text-gray-600 bg-blue-600 hover:bg-blue-500 focus:outline-none"
                  onClick={handleShowClick}
                  aria-label="Show password"
                >
                  {!showPassword ? (
                    <EyeSlashIcon className="w-3 h-3 text-white" />
                  ) : (
                    <EyeIcon className="w-3 h-3 text-white" />
                  )}
                </button>
              </div>
            </div>
            <div className="form-error-message text-red-600 mt-1">
              {formik.errors.confirmPassword}
            </div>
          </div>

          <button
            className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => formik.handleSubmit}
          >
            Register
          </button>
        </div>
      </form>
    </UserLogin>
  );
}

export default RegistrationPage;
