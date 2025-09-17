import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Building } from "../types/building";
import { getBuildingById } from "../services/buildingService";
import { PopupType, useToast } from "../hooks/useToast";
import axios from "axios";
import FullScreenLoader from "../components/FullScreenLoader";
import { formatDate } from "../utils/dateFormatter";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import BuildingApartments from "../components/Building/BuildingApartments";

export default function BuildingDetailsPage() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const [building, setBuilding] = useState<Building>({} as Building);
  const [loading, setLoading] = useState<boolean>(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchBuilding = async () => {
      if (buildingId) {
        try {
          setLoading(true);
          const data = await getBuildingById(buildingId);
          setBuilding(data);
        }
        catch (err) {
          if (axios.isAxiosError(err)) {
            showToast(PopupType.Danger, err.response?.data || err);
          }
          else {
            showToast(PopupType.Danger, `Unkown error: ${err}`);
          }
        }
        finally {
          setLoading(false);
        }
      }
    };

    fetchBuilding();
  }, []);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <div className="planel shadow-md flex-col flex justify-center bg-white rounded-md p-4 mb-10">
        <h1 className="text-3xl mb-10">Detalji zgrade</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 w-full">
          <div className="col-span-2 sm:col-span-3 grid grid-cols-2 sm:grid-cols-3">
            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Broj parcele:</span>
              <span>{building.parcelNumber}</span>
            </div>
            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Površina placa:</span>
              <span>{building.area}</span>
            </div>
            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Broj spratova:</span>
              <span>{building.floorCount}</span>
            </div>

            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Broj liftova:</span>
              <span>{building.elevatorCount}</span>
            </div>
            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Broj garažnih mesta:</span>
              <span>{building.garageSpotCount}</span>
            </div>
            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Status izgradnje:</span>
              <span className={`${building.isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} w-fit text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>{building.isCompleted ? "Završena" : "U izgradnji"}</span>
            </div>

            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Datum početka izgradnje:</span>
              <span>{formatDate(building.startDate)}</span>
            </div>
            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Datum završetka izgradnje:</span>
              <span>{formatDate(building.endDate)}</span>
            </div>
            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Datum produženja izgradnje:</span>
              <span>{building.extendedUntil ? formatDate(building.extendedUntil) : "/"}</span>
            </div>

            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Grad:</span>
              <span>{building.city}</span>
            </div>
            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Adresa:</span>
              <span>{building.address}</span>
            </div>

            <div className="col-span-2 sm:col-span-3 flex flex-col mb-3">
              <span className="font-bold">Opis:</span>
              <span>{building.description || "/"}</span>
            </div>

            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Cena stana po kvadratu:</span>
              <span>{building.priceList?.pricePerM2}</span>
            </div>
            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Cena penala izgradnje po kvadratu:</span>
              <span>{building.priceList?.penaltyPerM2}</span>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 flex flex-col">
            <span className="font-bold">Lokacija zgrade:</span>
            {building.latitude
              ? (
                  <MapContainer
                    center={[building.latitude, building.longitude]}
                    zoom={15}
                    style={{ height: "400px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker
                      position={[building.latitude, building.longitude]}
                    >
                      <Popup>
                        📍
                        {" "}
                        {building.address || "Lokacija zgrade"}
                      </Popup>
                    </Marker>
                  </MapContainer>
                )
              : <span>Nema lokacije</span>}
          </div>
        </div>
      </div>

      <BuildingApartments existingApartments={building.apartments ?? []} />
    </>
  );
}
