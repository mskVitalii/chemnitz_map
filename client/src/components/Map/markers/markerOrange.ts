import L from "leaflet";
import marker from "@assets/marker/markerOrange.svg";
export default new L.Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  popupAnchor: [-0, -0],
  iconSize: [34, 48],
});
