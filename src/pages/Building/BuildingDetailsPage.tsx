import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Building } from "../../types/building";
import { deleteBuilding, getBuildingById } from "../../services/buildingService";
import { PopupType, useToast } from "../../hooks/useToast";
import FullScreenLoader from "../../components/FullScreenLoader";
import { formatDate } from "../../utils/dateFormatter";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import BuildingApartments from "../../components/Building/BuildingApartments";
import { ClockPlus, PenLine, Trash } from "lucide-react";
import Modal from "../../components/Modal";
import ExtendBuildingEndModal from "../../components/Building/ExtendBuildingEndModal";
import { RequireRole } from "../../components/Auth/RequireRole";
import SendRequestButtonModal from "../../components/AgencyRequest/SendRequestButtonModal";
import { handleError } from "../../utils/handleError";
import BuildingGarages from "../../components/Building/BuildingGarages";

export default function BuildingDetailsPage() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const [building, setBuilding] = useState<Building>({} as Building);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenExtend, setIsOpenExtend] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(1);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const storedTab = localStorage.getItem("buildingActiveTab");
    if (storedTab) {
      setActiveTab(Number(storedTab));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("buildingActiveTab", activeTab.toString());
  }, [activeTab]);

  useEffect(() => {
    const fetchBuilding = async () => {
      if (buildingId) {
        try {
          setLoading(true);
          const data = await getBuildingById(buildingId);
          setBuilding(data);
        }
        catch (err) {
          handleError(err);
        }
        finally {
          setLoading(false);
        }
      }
    };

    fetchBuilding();
  }, [reload]);

  const handleDelete = async () => {
    if (buildingId) {
      try {
        setLoadingModal(true);
        await deleteBuilding(buildingId);
        showToast(PopupType.Success, "Zgrada je uspešno izbrisana");
        navigate("/buildings");
      }
      catch (err) {
        handleError(err);
      }
      finally {
        setLoadingModal(false);
      }
    }
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <div className="planel shadow-md flex-col flex justify-center bg-white rounded-md p-4 mb-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl">Detalji zgrade</h1>
          <RequireRole roles={["Company"]}>
            <div className="flex gap-2">
              {!building.extendedUntil && (
                <button className="btn btn-info flex justify-center items-center" onClick={() => setIsOpenExtend(true)}>
                  <span className="mr-2">Produži</span>
                  <ClockPlus />
                </button>
              )}
              <button className="btn btn-primary px-3" onClick={() => navigate(`/buildings/${building.id}/edit`)}><PenLine size={18} /></button>
              <button className="btn btn-danger px-3" onClick={() => setIsOpen(true)}><Trash size={18} /></button>
            </div>
          </RequireRole>
          <RequireRole roles={["Agency"]}>
            <SendRequestButtonModal building={building} setReload={setReload} />
          </RequireRole>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 w-full">
          <div className="col-span-2 sm:col-span-3 grid grid-cols-2 sm:grid-cols-3">
            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Broj parcele:</span>
              <span>{building.parcelNumber}</span>
            </div>
            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Površina placa:</span>
              <span>
                {building.area}
                m²
              </span>
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
              <span>
                {building.priceList?.pricePerM2}
                €
              </span>
            </div>
            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Cena penala izgradnje po kvadratu:</span>
              <span>
                {building.priceList?.penaltyPerM2}
                €
              </span>
            </div>
            <div className="col-span-1 flex flex-col mb-3">
              <span className="font-bold">Cena garažnog mesta:</span>
              <span>
                {building.priceList?.garagePrice}
                €
              </span>
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

      <div className="planel shadow-md flex-col flex justify-center bg-white rounded-md p-4">
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-10">
          <ul className="flex flex-wrap -mb-px">
            <li className="me-2">
              <button
                onClick={() => {
                  setActiveTab(1);
                }}
                className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                  activeTab === 1
                    ? "text-primary border-primary"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 "
                }`}
              >
                Stanovi
              </button>
            </li>
            <li className="me-2">
              <button
                onClick={() => {
                  setActiveTab(2);
                }}
                className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                  activeTab === 2
                    ? "text-primary border-primary"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 "
                }`}
              >
                Garaže
              </button>
            </li>
          </ul>
        </div>

        {activeTab === 1 && <BuildingApartments floorCount={building.floorCount} apartments={building.apartments ?? []} buildingId={building.id} setReload={setReload} />}
        {activeTab === 2 && <BuildingGarages garages={building.garages ?? []} setReload={setReload} apartments={building.apartments ?? []} />}
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Brisanje zgrade" onConfirm={handleDelete} loading={loadingModal}>
        <div>
          <p>Da li ste sigurni da želite da izbrišete ovu zgradu?</p>
        </div>
      </Modal>

      <ExtendBuildingEndModal building={building} isOpen={isOpenExtend} setIsOpen={setIsOpenExtend} setReload={setReload} />
    </>
  );
}
