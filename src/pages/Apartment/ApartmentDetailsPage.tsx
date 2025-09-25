import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { Apartment } from "../../types/apartment";
import { getApartmentById } from "../../services/apartmentService";
import { handleError } from "../../utils/handleError";
import FullScreenLoader from "../../components/FullScreenLoader";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { BadgeEuro, Bookmark, Percent } from "lucide-react";
import Tooltip from "../../components/Tooltip";

export default function ApartmentDetailsPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [apartment, setApartment] = useState<Apartment>({} as Apartment);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartment = async () => {
      if (apartmentId) {
        try {
          setLoading(true);
          const data = await getApartmentById(apartmentId);
          setApartment(data);
        }
        catch (err) {
          handleError(err);
        }
        finally {
          setLoading(false);
        }
      }
    };

    fetchApartment();
  }, []);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="planel shadow-md flex-col flex justify-center bg-white rounded-md p-4 mb-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl">Detalji stana</h1>
        <div className="flex gap-2">
          {apartment.canRequestDiscount && (
            <Tooltip text="Pošalji zahtev za popust">
              <button className="btn btn-secondary flex gap-2">
                <Percent />
                Popust
              </button>
            </Tooltip>
          )}
          <button className="btn btn-info flex gap-2" disabled={apartment.isReserved}>
            <Bookmark />
            {apartment.isReserved ? "Rezervisano" : "Rezerviši"}
          </button>
          <button className="btn btn-primary flex gap-2" disabled={apartment.isReserved} onClick={() => navigate(`buy`)}>
            <BadgeEuro />
            Kupi
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 w-full">
        <div className="col-span-2 sm:col-span-3 grid grid-cols-2 sm:grid-cols-3">
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Broj stana:</span>
            <span>{apartment.apartmentNumber}</span>
          </div>
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Površina stana:</span>
            <span>
              {apartment.area}
              m²
            </span>
          </div>
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Sprat:</span>
            <span>{apartment.floor}</span>
          </div>

          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Broj soba:</span>
            <span>{apartment.roomCount}</span>
          </div>
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Broj terasa:</span>
            <span>{apartment.balconyCount}</span>
          </div>
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Status izgradnje zgrade:</span>
            <span className={`${apartment.building.isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} w-fit text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>{apartment.building.isCompleted ? "Završena" : "U izgradnji"}</span>
          </div>

          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Grad:</span>
            <span>{apartment.building.city}</span>
          </div>
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Adresa:</span>
            <span>{apartment.building.address}</span>
          </div>
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Agencija:</span>
            <Link to="" className="text-primary hover:underline">{apartment.agency?.name}</Link>
          </div>

          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Cena stana:</span>
            <span>
              {apartment.area * (apartment.building.priceList?.pricePerM2 ?? 1)}
              €
            </span>
          </div>

        </div>
        <div className="col-span-2 sm:col-span-1 flex flex-col">
          <span className="font-bold">Lokacija zgrade:</span>
          {apartment.building.latitude
            ? (
                <MapContainer
                  center={[apartment.building.latitude, apartment.building.longitude]}
                  zoom={15}
                  style={{ height: "400px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker
                    position={[apartment.building.latitude, apartment.building.longitude]}
                  >
                    <Popup>
                      📍
                      {" "}
                      {apartment.building.address || "Lokacija zgrade"}
                    </Popup>
                  </Marker>
                </MapContainer>
              )
            : <span>Nema lokacije</span>}
        </div>
      </div>
    </div>
  );
}
