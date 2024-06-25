import { useEffect, useState } from "react";
import { Description, Field, Label, Switch } from "@headlessui/react";
import { useUserClaimsQuery, useUserQuery } from "@app/state/user";
import { classNames } from "@app/utils/common";
import API from "@app/api/api";
import { IUserData } from "@app/interfaces/user";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const UserAccountTypeModal = () => {
  const [isPro, setIsPro] = useState(false);

  const queryClient = useQueryClient();

  const userClaims = useUserClaimsQuery();
  const user = useUserQuery(userClaims.data?.id);

  useEffect(() => {
    if (user.data) {
      setIsPro(user.data.userType === "pro");
    }
  }, [user.data]);

  const handleClick = (val: boolean) => {
    if (user.data?._id) {
      setIsPro(val);

      const data: IUserData = {
        ...user.data,
        userType: val ? "pro" : "regular",
      };
      API.user.put(user.data._id, data).then(() => {
        toast.success("Account type updated");
        queryClient.invalidateQueries({ queryKey: ["user"] });
      });
    }
  };

  return (
    <div className="">
      <Field as="div" className="px-4 py-5 sm:p-6">
        <Label
          as="h3"
          className="text-base font-semibold leading-6 text-gray-900"
          passive
        >
          Pro subscription
        </Label>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-gray-500">
            <Description>
              Subscription "pro" allows you to add an unlimited amount of favourite and home
              points
            </Description>
          </div>
          <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
            <Switch
              checked={isPro}
              onChange={handleClick}
              className={classNames(
                isPro ? "bg-blue-600" : "bg-gray-200",
                "relative inline-flex p-0 h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  isPro ? "translate-x-5" : "translate-x-0",
                  "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                )}
              />
            </Switch>
          </div>
        </div>
      </Field>
    </div>
  );
};

export default UserAccountTypeModal;
