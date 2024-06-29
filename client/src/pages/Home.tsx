import API from "@app/api/api";
import ModalTemplate from "@app/components/Containers/ModalTemplate";
import POIModal from "@app/components/Containers/POIModal";
import CategotySelect from "@app/components/Interactive/CategorySelect";
import { Map } from "@app/components/Map/Map";
import { ICategoryUI, IRoute } from "@app/interfaces/places";
import { usePlaceQuery } from "@app/state/place";
import { useUserClaimsQuery, useUserQuery } from "@app/state/user";
import { classNames } from "@app/utils/common";
import logo from "@assets/logo.svg";
import avatar from "@assets/user.svg";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Field,
  Label,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Switch,
  Transition
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const categories: ICategoryUI[] = [
  { name: "Schools", secondary: "Schule", value: "Schulen", color: "#7c3aed" },
  {
    name: "Kindergarten",
    secondary: "Kindertageseinrichtungen",
    value: "Kindertageseinrichtungen",
    color: "#16a34a"
  },
  {
    name: "Social child projects",
    secondary: "Schulsozialarbeit",
    value: "Schulsozialarbeit",
    color: "#f97316"
  },
  {
    name: "Social teenager projects",
    secondary: "Jugendberufshilfe",
    value: "Jugendberufshilfen",
    color: "#2563eb"
  }
];

function HomePage() {
  const [selected, setSelected] = useState<ICategoryUI[]>([]);
  const [currPlaceId, setCurrPlaceId] = useState<string>();
  const [showFav, setShowFav] = useState<boolean>(true);
  const [showHome, setShowHome] = useState<boolean>(true);

  const [route, setRoute] = useState<IRoute>();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const place = usePlaceQuery(currPlaceId);
  const userClaims = useUserClaimsQuery();
  const user = useUserQuery(userClaims.data?.id);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["placesList"] });
  }, [selected]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["place"] });
  }, [currPlaceId]);

  return (
    <>
      <ModalTemplate
        dialogSize="xl"
        isOpen={!!currPlaceId}
        onClose={() => setCurrPlaceId(undefined)}
      >
        {/* <JsonToForm jsonData={place.data || {}} /> */}
        {!isEmpty(place.data) ? (
          <POIModal
            jsonData={place.data}
            setRoute={setRoute}
            onClose={() => setCurrPlaceId(undefined)}
          />
        ) : (
          <></>
        )}
      </ModalTemplate>
      <div className="min-h-screen relative">
        <Disclosure
          as="nav"
          className="absolute bg-transparent z-20 top-4 right-0 left-0 md:mx-0 lg:mx-6 xl:mx-20"
        >
          {({ open }) => (
            <>
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between bg-white shadow-sm rounded-lg px-4 py-2 lg:divide-x-2">
                  <a
                    href="/"
                    className="flex flex-row items-center space-x-4 max-w-fit min-w-[180px]"
                  >
                    <img className="h-8" src={logo} alt="Chemnitz maps" />
                    <p className="text-gray-800 font-medium text-nowrap">
                      Chemnitz maps
                    </p>
                  </a>
                  <div className="hidden lg:flex flex-row items-center space-x-2 h-full w-full px-6">
                    <CategotySelect
                      categories={categories}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    {user.data?._id && (
                      <>
                        <Field
                          as="div"
                          className="flex flex-row items-center space-y-2 md:space-y-0 md:space-x-4 md:pl-4"
                        >
                          <Label className="block text-sm font-medium leading-6 text-gray-600 min-w-[120px]">
                            Show favourite(s):
                          </Label>
                          <Switch
                            checked={showFav}
                            onChange={setShowFav}
                            className={classNames(
                              showFav ? "bg-blue-600" : "bg-gray-200",
                              "relative inline-flex p-0 h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                            )}
                          >
                            <span className="sr-only">Show favorite place</span>
                            <span
                              aria-hidden="true"
                              className={classNames(
                                showFav ? "translate-x-4" : "translate-x-0",
                                "pointer-events-none inline-block min-h-4 min-w-5 h-4 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                              )}
                            />
                          </Switch>
                        </Field>

                        <Field
                          as="div"
                          className="flex flex-row items-center space-y-2 md:space-y-0 md:space-x-4 md:pl-4"
                        >
                          <Label className="block text-sm font-medium leading-6 text-gray-600 min-w-[100px]">
                            Show home(s):
                          </Label>
                          <Switch
                            checked={showHome}
                            onChange={setShowHome}
                            className={classNames(
                              showHome ? "bg-blue-600" : "bg-gray-200",
                              "relative inline-flex p-0 h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                            )}
                          >
                            <span className="sr-only">Show home(s)</span>
                            <span
                              aria-hidden="true"
                              className={classNames(
                                showHome ? "translate-x-4" : "translate-x-0",
                                "pointer-events-none inline-block min-h-4 min-w-5 h-4 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                              )}
                            />
                          </Switch>
                        </Field>
                      </>
                    )}
                  </div>
                  <div className="hidden lg:block">
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
                  <div className="-mr-2 flex lg:hidden">
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

              <DisclosurePanel className="lg:hidden px-4">
                <div className="border-t border-gray-200 pb-3 pt-4 bg-white rounded-md">
                  <div className="lg:hidden flex flex-col items-start space-y-2 h-full w-full px-6 border-b border-slate-300">
                    <CategotySelect
                      categories={categories}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    {user.data?._id && (
                      <>
                        <Field
                          as="div"
                          className="flex flex-row w-full items-center space-x-2 py-3"
                        >
                          <Label className="block text-sm font-medium leading-6 text-gray-600 min-w-[100px]">
                            Show favourite(s):
                          </Label>
                          <Switch
                            checked={showFav}
                            onChange={setShowFav}
                            className={classNames(
                              showFav ? "bg-blue-600" : "bg-gray-200",
                              "relative inline-flex p-0 h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                            )}
                          >
                            <span className="sr-only">Show favorite place</span>
                            <span
                              aria-hidden="true"
                              className={classNames(
                                showFav ? "translate-x-4" : "translate-x-0",
                                "pointer-events-none inline-block min-h-4 min-w-5 h-4 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                              )}
                            />
                          </Switch>
                        </Field>

                        <Field
                          as="div"
                          className="flex flex-row w-full items-center space-x-2 py-3"
                        >
                          <Label className="block text-sm font-medium leading-6 text-gray-600 min-w-[100px]">
                            Show home(s):
                          </Label>
                          <Switch
                            checked={showHome}
                            onChange={setShowHome}
                            className={classNames(
                              showHome ? "bg-blue-600" : "bg-gray-200",
                              "relative inline-flex p-0 h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                            )}
                          >
                            <span className="sr-only">Show home(s)</span>
                            <span
                              aria-hidden="true"
                              className={classNames(
                                showHome ? "translate-x-4" : "translate-x-0",
                                "pointer-events-none inline-block min-h-4 min-w-5 h-4 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                              )}
                            />
                          </Switch>
                        </Field>
                      </>
                    )}
                  </div>
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
        <main className="h-screen pt-24 lg:pt-0 relative z-0">
          <div className="w-screen h-full">
            <Map
              showFav={showFav}
              showHome={showHome}
              selected={selected}
              setPlaceId={setCurrPlaceId}
              route={route}
            />
            {route && (
              <div className="absolute top-[90px] right-1 md:right-[10px] w-[340px] md:w-[320px] z-[1001]">
                <button
                  onClick={() => {
                    setRoute(undefined);
                  }}
                  className="w-full justify-center border-2 border-black/30 inline-flex cursor-pointer items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 hover:text-white shadow-sm hover:bg-red-500 hover:border-black/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Delete route
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default HomePage;
