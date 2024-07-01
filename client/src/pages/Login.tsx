import API from "@app/api/api";
import UserLogin from "@app/components/Containers/UserLogin";
import { ILoginData } from "@app/interfaces/user";
import configuration from "@app/utils/config";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon
} from "@heroicons/react/20/solid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

function LoginPage() {
  const { errStatus } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required()
  });

  const handleShowClick = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (errStatus) {
      switch (errStatus) {
        case "user-deleted":
          toast.error("This account is deleted. Contact support to restore");
          break;
        case "google-error":
          toast.error("Google authentication error");
          break;
        default:
          toast.error("Server error");
      }
    }
  }, [errStatus]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const loginData: ILoginData = {
        email: values.email,
        password: values.password
      };

      await API.auth.login(loginData).then(() => {
        navigate("/", { replace: true });
      });
    }
  });

  return (
    <UserLogin title="Log in">
      <div className="pt-5 flex justify-center mb-5 mt-[-5px]">
        <p className="text-slate-600 text-base font-normal line-clamp-3">
          Don&apos;t have an account?
        </p>
        <Link to="/registration">
          <p className="ml-2 text-cyan-600 text-base line-clamp-3 font-semibold">
            Register
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
            <div className="form-error-message text-red-600 mt-1">
              {formik.errors.password}
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => formik.handleSubmit}
          >
            Log in
          </button>
          <button
            className="w-full p-3 bg-slate-200 hover:bg-slate-300 text-gray-700"
            onClick={(e) => {
              e.preventDefault();
              window.location.href =
                configuration.baseUrl + "/api/v1/google/login";
            }}
          >
            Log in via Google
          </button>
        </div>
      </form>
    </UserLogin>
  );
}

export default LoginPage;
