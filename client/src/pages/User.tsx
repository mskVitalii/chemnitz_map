import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import logo from "@assets/logo.svg";
import avatar from "@assets/user.svg";
import { Map } from "@app/components/Map/Map";
import CategotySelect from "@app/components/Interactive/CategorySelect";
import { useEffect, useState } from "react";
import { usePlaceQuery, usePlacesListQuery } from "@app/state/place";
import { ICategoryUI } from "@app/interfaces/places";
import { useQueryClient } from "@tanstack/react-query";
import ModalTemplate from "@app/components/Containers/ModalTemplate";
import POIModal from "@app/components/Containers/POIModal";
import { isEmpty } from "lodash";
import { useUserClaimsQuery, useUserQuery } from "@app/state/user";
import API from "@app/api/api";
import { toast } from "react-toastify";
import { HomeIcon } from "@heroicons/react/20/solid";
import { classNames } from "@app/utils/common";
import UserAccountTypeModal from "@app/components/Containers/UserAcountTypeModal";
import AddHomeModal from "@app/components/Containers/AddHomeModal";
import { IHome, IUserData } from "@app/interfaces/user";
import HomeCard from "@app/components/Containers/HomeCard";
import DeleteConfirmModal from "@app/components/Containers/DeleteConfirmModal";
import { useNavigate } from "react-router-dom";

const pages = [{ name: "Profile settings", href: "/profile", current: true }];

const UserPage = () => {
  const [homeModal, setHomeModal] = useState<boolean>(false);
  const [subModal, setSubModal] = useState<boolean>(false);
  const [delModal, setDelModal] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const userClaims = useUserClaimsQuery();
  const user = useUserQuery(userClaims.data?.id);

  const navigate = useNavigate();

  return (
    <div className="mx-auto flex flex-col max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
      <div className="mx-auto w-full max-w-5xl bg-white rounded-lg mt-6 shadow-md">
        <>
          <DeleteConfirmModal
            isOpen={delModal}
            onClose={() => setDelModal(false)}
            deleteTarget="Account"
            confirm={() => {
              if (user.data?._id) {
                API.user.delete(user.data._id).then(() => {
                  navigate("/login")
                  toast.info("Account successfully deleted");
                });
              }
            }}
          />
          <ModalTemplate
            dialogSize="xl"
            isOpen={homeModal}
            onClose={() => setHomeModal(false)}
          >
            <AddHomeModal onClose={() => setHomeModal(false)} />
          </ModalTemplate>
          <ModalTemplate
            dialogSize="medium"
            isOpen={subModal}
            onClose={() => setSubModal(false)}
          >
            <UserAccountTypeModal />
          </ModalTemplate>
          <Disclosure
            as="nav"
            className="bg-transparent mx-auto w-full max-w-5xl"
          >
            {({ open }) => (
              <>
                <div className="">
                  <div className="flex h-16 items-center justify-between bg-white rounded-lg px-4 py-2 lg:divide-x-2">
                    <a
                      href="/"
                      className="flex flex-row items-center space-x-4 max-w-fit min-w-[180px]"
                    >
                      <img className="h-8" src={logo} alt="Chemnitz maps" />
                      <p className="text-gray-800 font-medium text-nowrap">
                        Chemnitz maps
                      </p>
                    </a>
                    <div className="hidden md:block">
                      <div className="flex items-center">
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <MenuButton className="relative -right-2 flex max-w-xs items-center rounded-lg bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              <Bars3Icon
                                className="block h-6 w-6 text-blue-600"
                                aria-hidden="true"
                              />
                            </MenuButton>
                          </div>
                          <Transition
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {user.data?._id ? (
                                <>
                                  <div
                                    className="flex my-4 items-center px-5"
                                    title={user.data.email}
                                  >
                                    <div className="flex-shrink-0">
                                      <img
                                        className="h-6 w-6 mt-1 rounded-full"
                                        src={avatar}
                                        alt=""
                                      />
                                    </div>
                                    <div className="ml-3">
                                      <div className="text-base truncate max-w-28 font-medium leading-none text-gray-500">
                                        {user.data.email}
                                      </div>
                                    </div>
                                  </div>
                                  <MenuItem>
                                    {({ focus }) => (
                                      <a
                                        href="/profile"
                                        className={classNames(
                                          focus ? "bg-gray-100" : "",
                                          "block px-4 py-2 text-sm text-gray-700 hover:text-blue-600"
                                        )}
                                      >
                                        Profile settings
                                      </a>
                                    )}
                                  </MenuItem>

                                  <MenuItem>
                                    {({ focus }) => (
                                      <a
                                        className={classNames(
                                          focus ? "bg-gray-100" : "",
                                          "block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 cursor-pointer"
                                        )}
                                        onClick={() => {
                                          API.auth.logout().then(() => {
                                            navigate("/login");
                                            toast.info("Successfully log out");
                                          });
                                        }}
                                      >
                                        Log out
                                      </a>
                                    )}
                                  </MenuItem>
                                </>
                              ) : (
                                <>
                                  <MenuItem>
                                    {({ focus }) => (
                                      <a
                                        href="/registration"
                                        className={classNames(
                                          focus ? "bg-gray-100" : "",
                                          "block px-4 py-2 text-sm text-gray-700 hover:text-blue-600"
                                        )}
                                      >
                                        Register
                                      </a>
                                    )}
                                  </MenuItem>
                                  <MenuItem>
                                    {({ focus }) => (
                                      <a
                                        href="/login"
                                        className={classNames(
                                          focus ? "bg-gray-100" : "",
                                          "block px-4 py-2 text-sm text-gray-700 hover:text-blue-600"
                                        )}
                                      >
                                        Log in
                                      </a>
                                    )}
                                  </MenuItem>
                                </>
                              )}
                            </MenuItems>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                      {/* Mobile menu button */}
                      <DisclosureButton className="relative inline-flex items-center justify-center rounded-md bg-blue-100 p-2 text-blue-500 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6 text-blue-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6 text-blue-500"
                            aria-hidden="true"
                          />
                        )}
                      </DisclosureButton>
                    </div>
                  </div>
                </div>

                <DisclosurePanel className="md:hidden px-4 absolute right-4 left-4 shadow-md">
                  <div className="border-t border-gray-200 pb-3 pt-4 bg-white rounded-md">
                    {user.data?._id ? (
                      <>
                        <div className="flex my-4 items-center px-5">
                          <div className="flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={avatar}
                              alt=""
                            />
                          </div>
                          <div className="ml-3">
                            <div className="text-base font-medium leading-none text-gray-500">
                              {user.data.email}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                          <DisclosureButton
                            as="a"
                            href="/profile"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white text-left"
                          >
                            Profile settings
                          </DisclosureButton>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                          <DisclosureButton
                            as="a"
                            onClick={() => {
                              API.auth.logout().then(() => {
                                navigate("/login");
                                toast.info("Successfully log out");
                              });
                            }}
                            className="block cursor-pointer rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white text-left"
                          >
                            Log out
                          </DisclosureButton>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mt-3 space-y-1 px-2">
                          <DisclosureButton
                            as="a"
                            href="/registration"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white text-left"
                          >
                            Register
                          </DisclosureButton>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                          <DisclosureButton
                            as="a"
                            href="/login"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white text-left"
                          >
                            Log in
                          </DisclosureButton>
                        </div>
                      </>
                    )}
                  </div>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
          <nav className="flex mt-6 w-full pb-3" aria-label="Breadcrumb">
            <ol role="list" className="flex space-x-4 rounded-md bg-white px-6">
              <li className="flex">
                <div className="flex items-center">
                  <a href="/" className="text-gray-400 hover:text-gray-500">
                    <HomeIcon
                      className="h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Home</span>
                  </a>
                </div>
              </li>
              {pages.map((page) => (
                <li key={page.name} className="flex">
                  <div className="flex items-center">
                    <svg
                      className="h-full w-4 flex-shrink-0 text-gray-200"
                      viewBox="0 0 24 44"
                      preserveAspectRatio="none"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                    </svg>
                    <a
                      href={page.href}
                      className="ml-4 text-sm text-left font-medium text-gray-500 hover:text-gray-700"
                      aria-current={page.current ? "page" : undefined}
                    >
                      {page.name}
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-col items-start px-6 mt-6">
            <div className="px-4 sm:px-0 flex flex-row justify-between w-full">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Information
              </h3>
              <button
                onClick={() => setDelModal(true)}
                className="mr-4 min-w-[72px] inline-flex cursor-pointer items-center gap-x-1.5 rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Delete account
              </button>
            </div>
            <div className="mt-6 border-t border-gray-100 w-full">
              <dl className="divide-y divide-gray-100">
                <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <dt className="text-sm text-left font-medium leading-6 text-gray-900">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-left leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {user.data?.email}
                  </dd>
                </div>
                <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <dt className="text-sm text-left font-medium leading-6 text-gray-900">
                    Account type
                  </dt>
                  <dd className="mt-1 text-sm text-left leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <div className="flex flex-row items-center justify-between">
                      <p>{user.data?.userType}</p>
                      <button
                        onClick={() => setSubModal(true)}
                        className="min-w-[72px] inline-flex cursor-pointer items-center gap-x-1.5 rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                      >
                        Change account type
                      </button>
                    </div>
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                  <dt className="text-sm text-left font-medium leading-6 text-gray-900">
                    Providers
                  </dt>
                  <dd className="mt-1 text-sm text-left leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {user.data?.providers?.join(", ")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex flex-col items-start px-6 mt-10 pb-6">
            <div className="px-4 sm:px-0 text-left pb-4">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Home(s)*
              </h3>
              <p className="text-xs text-gray-500">
                {user.data?.userType === "regular"
                  ? '* you can add 1 home point. To add more points, upgrade your account type to "pro"'
                  : "* you can add an unlimited number of home points"}
              </p>
            </div>
            <button
              onClick={() => setHomeModal(true)}
              className="min-w-[72px] inline-flex cursor-pointer items-center gap-x-1.5 rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              {user.data?.userType === "pro"
                ? "Add home"
                : user.data?.homes.length === 0
                ? "Add home"
                : "Swith home point"}
            </button>
            <div className="flex flex-col w-full space-y-4 mt-4">
              {user.data?.homes.map((home: IHome, idx: number) => (
                <HomeCard
                  title={home.name}
                  lat={home.coords.y}
                  lon={home.coords.x}
                  deleteHandler={() => {
                    if (user.data?._id) {
                      const data: IUserData = {
                        ...user.data,
                        homes: user.data.homes.filter((el, i) => i !== idx),
                      };
                      // @ts-ignore
                      API.user.put(user.data._id, data).then(() => {
                        toast.success("Home point deleted");
                        queryClient.invalidateQueries({ queryKey: ["user"] });
                      });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default UserPage;
