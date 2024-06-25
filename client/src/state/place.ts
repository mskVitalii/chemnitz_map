import API from "@app/api/api";
import { TCategory } from "@app/interfaces/places";
import { useQuery } from "@tanstack/react-query";

const fetchPlacesList = async (categories: TCategory[]) => {
  if (categories.length) {
    const res = await API.places.getList(categories);
    return res.data.data;
  } else {
    return [];
  }
};

const fetchPlaceByID = async (id: string | undefined) => {
  if (id) {
    const res = await API.places.getByID(id);
    return res.data.data;
  } else {
    return null;
  }
};

export const usePlacesListQuery = (categories: TCategory[]) => {
  return useQuery({
    queryKey: ["placesList", categories],
    queryFn: () => fetchPlacesList(categories),
  });
};

export const usePlaceQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ["place", id],
    queryFn: () => fetchPlaceByID(id),
    enabled: !!id
  });
};