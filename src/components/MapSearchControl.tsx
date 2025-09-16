import { OpenStreetMapProvider } from "leaflet-geosearch";
import { GeoSearchControl } from "leaflet-geosearch/lib/index.js";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapSearchControl({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    // @ts-expect-error no types available
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
    });

    map.addControl(searchControl);

    const onResult = (result: any) => {
      const { x, y } = result.location;
      onSelect(y, x);
      map.setView([y, x], 13);
    };

    map.on("geosearch/showlocation", onResult);

    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation", onResult);
    };
  }, [map, onSelect]);

  return null;
}
