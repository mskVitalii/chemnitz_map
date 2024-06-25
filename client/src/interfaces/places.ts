export type TCategory =
  | "Jugendberufshilfen"
  | "Kindertageseinrichtungen"
  | "Schulen"
  | "Schulsozialarbeit";

export interface ICategoryUI {
  name: string;
  secondary: string;
  value: TCategory;
  color: string;
}

export interface IPlace {
  _id: "string";
  category: TCategory;
  coords: {
    x: number;
    y: number;
  };
}

export interface IRoute {
  src: { x: number; y: number };
  dest: { x: number; y: number };
}
