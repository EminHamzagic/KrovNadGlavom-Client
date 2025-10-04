import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Delete the cached _getIconUrl so Leaflet doesn’t use broken default paths
// @ts-expect-error - accessing internal prop
delete L.Icon.Default.prototype._getIconUrl;

// Re-define proper asset URLs (Vite-compatible)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
