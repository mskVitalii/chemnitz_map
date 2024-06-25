import { ICategoryUI, IPlace, IRoute } from "@app/interfaces/places";
import { usePlacesListQuery } from "@app/state/place";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import markerBlue from "./markers/markerBlue";
import markerGreen from "./markers/markerGreen";
import markerOrange from "./markers/markerOrange";
import { LeafletMouseEvent } from "leaflet";
import markerViolet from "./markers/markerViolet";
import { useUserClaimsQuery, useUserQuery } from "@app/state/user";
import favourite from "./markers/markerFavourite";
import { IFav, IHome } from "@app/interfaces/user";
import markerFavourite from "./markers/markerFavourite";
import markerHome from "./markers/markerHome";

import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import { ReactElement, useEffect, useState } from "react";
import createRoutineMachineLayer from "./RoutingMachine";
import RoutineMachineLayer from "./RoutingMachine";

export const Map = ({
  selected,
  setPlaceId,
  showHome,
  showFav,
  route,
}: {
  selected: ICategoryUI[];
  setPlaceId: (data: string) => void;
  showHome: boolean;
  showFav: boolean;
  route?: IRoute;
}) => {
  const placesList = usePlacesListQuery(
    selected.map((category) => category.value)
  );

  const userClaims = useUserClaimsQuery();
  const user = useUserQuery(userClaims.data?.id);

  return (
    <MapContainer
      style={{ height: "100%" }}
      center={[50.830372, 12.909752]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        minZoom={0}
        maxZoom={22}
        attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=Kbidxh3pov3MdT3XfMzOGX105SxpI48uVZpWCNagU9KYsUzhnajY50U7UaLKneux"
      />
      {placesList.data?.map((place: IPlace) => (
        <Marker
          key={`place-marker-${place._id}`}
          position={[place.coords.y, place.coords.x]}
          icon={
            place.category === "Jugendberufshilfen"
              ? markerBlue
              : place.category === "Kindertageseinrichtungen"
              ? markerGreen
              : place.category === "Schulen"
              ? markerViolet
              : markerOrange
          }
          eventHandlers={{
            click: () => setPlaceId(place._id),
          }}
        ></Marker>
      ))}
      {showFav &&
        user.data?.favourites.map((place: IFav) => (
          <Marker
            key={`place-marker-${place._id}`}
            position={[place.coords.y, place.coords.x]}
            icon={markerFavourite}
            eventHandlers={{
              click: () => setPlaceId(place._id),
            }}
          ></Marker>
        ))}
      {showHome &&
        user.data?.homes.map((place: IHome) => (
          <Marker
            key={`place-marker-${place.name}`}
            position={[place.coords.y, place.coords.x]}
            icon={markerHome}
          ></Marker>
        ))}
      {route && <RoutineMachineLayer route={route} />}
    </MapContainer>
  );
};
