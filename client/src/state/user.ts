import API from "@app/api/api";
import { IUserData } from "@app/interfaces/user";
import { useQuery } from "@tanstack/react-query";

const fetchUserByID = async (id: string): Promise<IUserData> => {
  const res = await API.user.getByID(id);
  return res.data;
};

const fetchClaims = async () => {
  const res = await API.auth.claims();
  return res.data;
};

export const useUserQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ["user", id],
    // @ts-ignore
    queryFn: () => fetchUserByID(id),
    enabled: !!id
  });
};

export const useUserClaimsQuery = () => {
  return useQuery({
    queryKey: ["userClaims"],
    queryFn: () => fetchClaims(),
    retry: false
  });
};
