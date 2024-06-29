import { MapPinIcon } from "@heroicons/react/20/solid";

const HomeCard = ({
  title,
  lat,
  lon,
  deleteHandler
}: {
  title: string;
  lat: number;
  lon: number;
  deleteHandler: () => void;
}) => {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6 text-left flex flex-row w-full justify-between items-center">
        <p>{title}</p>
        <button
          onClick={() => deleteHandler()}
          className="inline-flex cursor-pointer items-center gap-x-1.5 rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Delete
        </button>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="text-sm text-left font-medium leading-6 text-gray-900">
          Coordinates
        </div>
        <div className="mt-1 flex flex-row items-center text-sm text-left leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <MapPinIcon className="h-3 w-3 mr-2" />
          <p>{`${lat}, ${lon}`}</p>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
