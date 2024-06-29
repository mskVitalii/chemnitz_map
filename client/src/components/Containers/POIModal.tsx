import API from "@app/api/api";
import { IRoute, TCategory } from "@app/interfaces/places";
import { IHome, IUserData } from "@app/interfaces/user";
import { useUserClaimsQuery, useUserQuery } from "@app/state/user";
import { haversineDistance } from "@app/utils/common";
import {
  EnvelopeIcon,
  HeartIcon as HeartIconFull,
  MapPinIcon,
  PhoneIcon
} from "@heroicons/react/20/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import JsonToForm from "./JsonToForm";
import ModalTemplate from "./ModalTemplate";

const POIModal = ({
  jsonData,
  setRoute,
  onClose
}: {
  jsonData: any;
  setRoute: (val: IRoute) => void;
  onClose: () => void;
}) => {
  const [isAllDataOpen, setIsAllDataOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const queryClient = useQueryClient();

  const userClaims = useUserClaimsQuery();
  const user = useUserQuery(userClaims.data?.id);

  useEffect(() => {
    if (user.data?.favourites.length) {
      let isFavFlag = false;
      user.data.favourites.map((elem) => {
        if (elem._id === jsonData._id) {
          isFavFlag = true;
        }
      });
      setIsFav(isFavFlag);
    }
  }, [user.data]);

  const handleFavClick = (
    id: string,
    x: number,
    y: number,
    category: TCategory
  ) => {
    if (user.data?._id) {
      setIsFav((prev) => {
        if (!prev) {
          const data: IUserData = {
            ...user.data,
            favourites:
              user.data.userType === "regular"
                ? [
                    {
                      _id: id,
                      coords: {
                        x,
                        y
                      },
                      category
                    }
                  ]
                : [
                    ...user.data.favourites,
                    {
                      _id: id,
                      coords: {
                        x,
                        y
                      },
                      category
                    }
                  ]
          };
          // @ts-ignore
          API.user.put(user.data._id, data).then(() => {
            user.data.userType === "regular"
              ? toast.success("Favorite place updated")
              : toast.success("Favorite place added");
            queryClient.invalidateQueries({ queryKey: ["user"] });
          });
        } else {
          {
            const data: IUserData = {
              ...user.data,
              favourites: user.data.favourites.filter((el) => el._id !== id)
            };
            // @ts-ignore
            API.user.put(user.data._id, data).then(() => {
              toast.success("Favorite place deleted");
              queryClient.invalidateQueries({ queryKey: ["user"] });
            });
          }
        }
        return !prev;
      });
    }
  };

  return (
    <>
      <ModalTemplate
        isOpen={isAllDataOpen}
        onClose={() => setIsAllDataOpen(false)}
      >
        <JsonToForm jsonData={jsonData} />
      </ModalTemplate>
      <button
        type="button"
        title={isFav ? "Exclude from favourites" : "Add to favourites"}
        onClick={() =>
          handleFavClick(
            jsonData._id,
            jsonData.coords.x,
            jsonData.coords.y,
            jsonData.category
          )
        }
        className="absolute top-3.5 right-12 rounded-full text-red-600 hover:border-red-600 hover:text-white bg-transparent p-1 ring-1 ring-inset focus:outline-none ring-slate-200 shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        {isFav ? (
          <HeartIconFull className="h-5 w-5" aria-hidden="true" />
        ) : (
          <HeartIcon className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
      <div className="bg-white pb-2 pr-14">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {jsonData?.other?.kurzbezeichnung ||
            jsonData?.other?.bezeichnung ||
            jsonData.street}
        </h3>
      </div>
      <h4 className="mt-1 max-w-2xl text-sm leading-6 text-sky-950">
        {jsonData.category === "Schulen"
          ? `Scools (Schulen) - ${jsonData.other.art}`
          : jsonData.category === "Jugendberufshilfen"
            ? "Social teenager projects (Jugendberufshilfen)"
            : jsonData.category === "Schulsozialarbeit"
              ? "Social child projects (Schulsozialarbeit)"
              : jsonData.category === "Kindertageseinrichtungen"
                ? "Kindergarten (Kindertageseinrichtungen)"
                : "Other"}
      </h4>
      <div className="mt-2 flex flex-row justify-start items-center max-w-2xl text-xs leading-6 text-gray-500">
        <MapPinIcon className="h-3 w-3 mr-2" />
        <p>{`${jsonData.coords?.y}, ${jsonData.coords?.x}`}</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Address
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <p>{jsonData.street}</p>
              <p>{`${jsonData.postCode}, ${jsonData.location}`}</p>
            </dd>
          </div>

          {jsonData.other?.bezeichnung && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Information
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {jsonData.other.bezeichnung}
              </dd>
            </div>
          )}
          {jsonData.other?.bezeichnungzusatz && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Additional Information
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {jsonData.other.bezeichnungzusatz}
              </dd>
            </div>
          )}
          {jsonData.telephone && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Phone
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="w-full h-full flex flex-row justify-between items-center">
                  <p>{jsonData.telephone}</p>
                  <a
                    type="button"
                    href={`tel:${
                      jsonData.telephone.replace(/\D/g, "").slice(0, 10)[0] ===
                      "0"
                        ? "+49" +
                          jsonData.telephone
                            .replace(/\D/g, "")
                            .slice(0, 10)
                            .slice(1)
                        : jsonData.telephone.replace(/\D/g, "").slice(0, 10)
                    }`}
                    className="min-w-[72px] inline-flex cursor-pointer items-center gap-x-1.5 rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    <PhoneIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Call
                  </a>
                </div>
              </dd>
            </div>
          )}
          {jsonData.other?.email && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Email address
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="w-full h-full flex flex-row justify-between items-center">
                  <p>{jsonData.other.email}</p>
                  <a
                    type="button"
                    href={`mailto:${jsonData.other.email}`}
                    className="min-w-[72px] inline-flex cursor-pointer items-center gap-x-1.5 rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    <EnvelopeIcon
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Mail
                  </a>
                </div>
              </dd>
            </div>
          )}
          {jsonData.other?.www && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Website
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <a
                  href={`https://${jsonData.other.www}`}
                  target="_blank"
                  className="text-blue-500 cursor-pointer"
                  rel="noreferrer"
                >
                  {jsonData.other.www}
                </a>
              </dd>
            </div>
          )}
          {jsonData.other?.leistungen && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Services
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {jsonData.other.leistungen}
              </dd>
            </div>
          )}
          {jsonData.other?.profile && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Profile
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {jsonData.other.profile}
              </dd>
            </div>
          )}
          {jsonData.other?.creationdate && jsonData.other?.creator && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Data created
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <p>{jsonData.other.creationdate}</p>
                <p>{jsonData.other.creator}</p>
              </dd>
            </div>
          )}
          {jsonData.other?.editdate && jsonData.other?.editor && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Data edited
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <p>{jsonData.other.editdate}</p>
                <p>{jsonData.other.editor}</p>
              </dd>
            </div>
          )}
          <div className="px-4 text-gray-600 py-6 flex items-center justify-center sm:px-0">
            <button
              tabIndex={0}
              className="ml-auto underline p-1 border-0 bg-transparent focus:outline-blue-600 text-blue-600 hover:text-blue-500 cursor-pointer"
              onClick={() => setIsAllDataOpen(true)}
            >
              View more
            </button>
          </div>
        </dl>
      </div>
      <div className="mt-6 border-t border-gray-100 w-full">
        <dl className="divide-y divide-gray-100">
          <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm text-left font-medium leading-6 text-gray-900">
              Distance to home(s)
            </dt>
            <dd className="mt-1 text-sm text-left leading-6 divide-y space-y-2 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.data?.homes.length && jsonData.coords
                ? user.data.homes.map((home) => (
                    <div
                      key={`${home.name}-${home.coords.y}-${home.coords.x}`}
                      className="flex flex-row justify-between pt-2 space-x-4 w-full border-gray-300"
                    >
                      <p>
                        <b>{`${home.name}`}</b>
                        {` - ${+haversineDistance(
                          jsonData.coords.y,
                          jsonData.coords.x,
                          home.coords.y,
                          home.coords.x
                        ).toFixed(3)} km`}
                      </p>
                    </div>
                  ))
                : "No home points specified"}
            </dd>
          </div>
        </dl>
      </div>
      <div className="mt-6 border-t border-gray-100 w-full">
        <dl className="divide-y divide-gray-100">
          <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm text-left font-medium leading-6 text-gray-900">
              Route to home(s)
            </dt>
            <dd className="mt-1 text-sm text-left leading-6 divide-y space-y-2 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.data?.homes.length && jsonData.coords
                ? user.data.homes.map((home: IHome) => (
                    <div
                      key={`${home.name}-${home.coords.y}-${home.coords.x}`}
                      className="flex flex-row justify-between pt-2 space-x-4 w-full border-gray-300"
                    >
                      <p>{`${home.name}`}</p>
                      <button
                        onClick={() => {
                          setRoute({
                            src: {
                              x: home.coords.x,
                              y: home.coords.y
                            },
                            dest: {
                              x: jsonData.coords.x,
                              y: jsonData.coords.y
                            }
                          });
                          onClose();
                        }}
                        className="w-[85px] justify-center h-[32px] inline-flex cursor-pointer items-center gap-x-1.5 rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                      >
                        Directions
                      </button>
                    </div>
                  ))
                : "No home points specified"}
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
};

export default POIModal;
