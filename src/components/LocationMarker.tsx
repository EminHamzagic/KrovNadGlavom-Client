import { Marker, useMapEvents } from "react-leaflet";
import type { BuildingToAdd } from "../types/building";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  buildingData: BuildingToAdd;
  setBuildingData: Dispatch<SetStateAction<BuildingToAdd>>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
}

export default function LocationMarker({ buildingData, setBuildingData, setErrors }: Props) {
  useMapEvents({
    click(e) {
      setBuildingData(prev => ({
        ...prev,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      }));
      setErrors(prev => ({
        ...prev,
        longitude: "",
      }));
    },
  });

  if (buildingData.latitude && buildingData.longitude) {
    return <Marker position={[buildingData.latitude, buildingData.longitude]} />;
  }

  return null;
}
