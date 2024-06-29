import API from "@app/api/api";
import { IUserData } from "@app/interfaces/user";
import { useUserClaimsQuery, useUserQuery } from "@app/state/user";
import { useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import HomeSearchCard from "./HomeSearchCard";

const AddHomeModal = ({ onClose }: { onClose: () => void }) => {
  const [address, setAddress] = useState<string>();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const queryClient = useQueryClient();

  const userClaims = useUserClaimsQuery();
  const user = useUserQuery(userClaims.data?.id);

  const debounceFn = useMemo(() => debounce(handleDebounceFn, 1000), []);

  function handleDebounceFn(inputValue: string) {
    if (inputValue.trim()) {
      API.external.nominatim.getCoords(inputValue).then(({ data }) => {
        if (data) {
          setSearchResults(data);
        }
      });
    }
  }

  const handleAddHome = (lon: number, lat: number, title: string) => {
    if (user.data?._id) {
      const data: IUserData = {
        ...user.data,
        homes:
          user.data.userType === "regular"
            ? [
                {
                  coords: {
                    x: +lon,
                    y: +lat
                  },
                  name: title
                }
              ]
            : [
                ...user.data.homes,
                {
                  coords: {
                    x: +lon,
                    y: +lat
                  },
                  name: title
                }
              ]
      };
      API.user.put(user.data._id, data).then(() => {
        toast.success("Home successfully added");
        queryClient.invalidateQueries({ queryKey: ["user"] });
        onClose();
      });
    }
  };

  return (
    <div className="flex flex-col items-start w-full">
      <label
        htmlFor="address"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Full address
      </label>
      <div className="mt-2 w-full">
        <input
          type="text"
          value={address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setAddress(e.target.value);
            debounceFn(e.target.value);
          }}
          name="address"
          id="address"
          className="block px-4 focus:outline-none bg-slate-100 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Country, City, Street, Apartment, ..."
        />
      </div>

      {!!searchResults.length && (
        <>
          <p className="block text-sm font-medium leading-6 text-gray-900 mt-6 pb-4">
            Choose place
          </p>
          <div className="flex flex-col w-full space-y-4">
            {searchResults.map((place) => (
              <HomeSearchCard
                key={`${place.display_name}-${place.lat}-${place.lon}`}
                title={place.display_name}
                lat={place.lat}
                lon={place.lon}
                placeClass={place.class}
                type={place.type}
                handler={handleAddHome}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AddHomeModal;
