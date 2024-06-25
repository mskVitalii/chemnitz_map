import L from "leaflet";
import marker from "@assets/marker/markerGreen.svg";
export default new L.Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});
