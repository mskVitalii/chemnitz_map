import { useEffect, useState } from "react";
import { Description, Field, Label, Switch } from "@headlessui/react";
import { useUserClaimsQuery, useUserQuery } from "@app/state/user";
import { classNames } from "@app/utils/common";
import API from "@app/api/api";
import { IUserData } from "@app/interfaces/user";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { MapPinIcon } from "@heroicons/react/20/solid";

const HomeSearchCard = ({
  title,
  lat,
  lon,
  placeClass,
  type,
  handler,
}: {
  title: string;
  lat: number;
  lon: number;
  placeClass: string;
  type: string;
  handler: (lon: number, lat: number, title: string) => void;
}) => {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">{title}</div>
      <div className="px-4 py-5 sm:p-6">
        <div className="mt-6 border-t border-gray-100 w-full">
          <dl className="divide-y divide-gray-100">
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-sm text-left font-medium leading-6 text-gray-900">
                Coordinates
              </dt>
              <dd className="mt-1 flex flex-row items-center text-sm text-left leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <MapPinIcon className="h-3 w-3 mr-2" />
                <p>{`${lat}, ${lon}`}</p>
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-sm text-left font-medium leading-6 text-gray-900">
                Class
              </dt>
              <dd className="mt-1 text-sm text-left leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {placeClass}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-sm text-left font-medium leading-6 text-gray-900">
                Address type
              </dt>
              <dd className="mt-1 text-sm text-left leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {type}
              </dd>
            </div>
          </dl>
        </div>
        <button
          onClick={() => handler(lon, lat, title)}
          className="mt-4 mr-4 w-full min-w-[72px] inline-flex cursor-pointer items-center gap-x-1.5 rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Add this point as home
        </button>
      </div>
    </div>
  );
};

export default HomeSearchCard;
