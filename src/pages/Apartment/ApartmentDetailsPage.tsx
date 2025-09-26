import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { Apartment } from "../../types/apartment";
import { getApartmentById } from "../../services/apartmentService";
import { handleError } from "../../utils/handleError";
import FullScreenLoader from "../../components/FullScreenLoader";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { BadgeEuro, Percent } from "lucide-react";
import Tooltip from "../../components/Tooltip";
import CreateDiscountRequestModal from "../../components/DiscountRequest/CreateDiscountRequestModal";
import { StatusEnum } from "../../types/agencyRequest";
import { RequireRole } from "../../components/Auth/RequireRole";
import ReserveButton from "../../components/Reservation/ReserveButton";
import { UserContext } from "../../context/UserContext";

export default function ApartmentDetailsPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [apartment, setApartment] = useState<Apartment>({} as Apartment);
  const [canBuy, setCanBuy] = useState<boolean>(false);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartment = async () => {
      if (apartmentId) {
        try {
          setLoading(true);
          const data = await getApartmentById(apartmentId);
          setApartment(data);
          if (data.reservation === null) {
            setCanBuy(true);
          }
          else {
            setCanBuy(data.reservation?.userId === user.id);
          }
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
  }, [reload]);

  const getDiscountPrice = (): number => {
    const price = apartment.area * (apartment.building.priceList?.pricePerM2 ?? 1);
    const newPrice = price - price * ((apartment.discountRequest?.percentage ?? 1) / 100);
    return Math.floor(newPrice);
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="planel shadow-md flex-col flex justify-center bg-white rounded-md p-4 mb-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
        <h1 className="text-3xl">Detalji stana</h1>
        <RequireRole roles={["User"]}>

          <div className="flex gap-2 flex-wrap justify-center">
            {apartment.canRequestDiscount && (
              <Tooltip text={apartment.discountRequest !== null ? "Već ste poslali zahtev za popust" : "Pošalji zahtev za popust"}>
                <button
                  className="btn btn-secondary flex gap-2"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                  disabled={apartment.discountRequest !== null}
                >
                  <Percent />
                  Popust
                </button>
              </Tooltip>
            )}
            <ReserveButton apartment={apartment} setReload={setReload} />
            <button className="btn btn-primary flex gap-2" disabled={!canBuy} onClick={() => navigate(`buy`)}>
              <BadgeEuro />
              Kupi
            </button>
          </div>
        </RequireRole>
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
            <Link to={`/agency/${apartment.agency?.id}`} className="text-primary hover:underline">{apartment.agency?.name}</Link>
          </div>

          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Cena stana:</span>
            <span className={`${apartment.discountRequest?.status === StatusEnum.Approved && "line-through mr-2"}`}>
              {apartment.area * (apartment.building.priceList?.pricePerM2 ?? 1)}
              €
            </span>
            {apartment.discountRequest && (
              <span className="text-red-800">
                {getDiscountPrice()}
                €
              </span>
            )}
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

      {!apartment.canRequestDiscount && <span className="text-sm italic mt-5">*Zaprati agenciju da bi mogao da pošalješ zahtev za popust!</span>}
      <CreateDiscountRequestModal apartment={apartment} isOpen={isOpen} setIsOpen={setIsOpen} setReload={setReload} />
    </div>
  );
}
