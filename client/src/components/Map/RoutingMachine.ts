import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { IRoute } from "@app/interfaces/places";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

const RoutineMachineLayer = ({ route }: { route: IRoute }) => {
  const map = useMap();
  const [control, setControl] = useState<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!!map && !!route) {
      setControl(
        L.Routing.control({
          waypoints: [
            L.latLng(route.dest.y, route.dest.x),
            L.latLng(route.src.y, route.src.x)
          ]
        })
      );
    }
  }, [map, route]);

  useEffect(() => {
    if (control) {
      control?.addTo(map);
    }
    return () => {
      control && map.removeControl(control);
    };
  }, [control]);

  return null;
};

export default RoutineMachineLayer;
