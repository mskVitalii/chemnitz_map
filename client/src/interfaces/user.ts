import { TCategory } from "./places";

export interface IHome {
  coords: {
    x: number;
    y: number;
  };
  name: string;
}

export interface IFav {
  _id: string;
  coords: {
    x: number;
    y: number;
  };
  category: TCategory;
}

export interface IUserData {
  _id?: string;
  email: string;
  favourites: IFav[];
  homes: IHome[];
  password: string;
  status: "active" | "deleted";
  userType: "regular" | "pro";
  providers?: string[];
}

export interface ILoginData {
  email: string;
  password: string;
}
