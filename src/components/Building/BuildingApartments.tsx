import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Apartment } from "../../types/apartment";
import Modal from "../Modal";
import { getOrientationLabel } from "../../utils/orientation";
import { MoreVertical, PenLine, Trash } from "lucide-react";
import { deleteApartment } from "../../services/apartmentService";
import { PopupType, useToast } from "../../hooks/useToast";
import axios from "axios";
import { RequireRole } from "../Auth/RequireRole";
import CreateApartmentModal from "../Apartment/CreateApartmentModal";

interface Props {
  apartments: Apartment[];
  floorCount: number;
  buildingId: string;
  setReload: Dispatch<SetStateAction<boolean>>;
}

export default function BuildingApartments({ apartments, floorCount, buildingId, setReload }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | undefined>();
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [editApartment, setEditApartment] = useState<Apartment>({} as Apartment);
  const [activeFloor, setActiveFloor] = useState<number>(1);

  const { showToast } = useToast();

  const handleDelete = async () => {
    if (selectedApartment) {
      try {
        setLoading(true);
        await deleteApartment(selectedApartment.id);

        showToast(PopupType.Success, "Stan je uspešno izbrisan");
        setSelectedApartment(undefined);
        setReload(prev => !prev);
      }
      catch (err) {
        if (axios.isAxiosError(err)) {
          showToast(PopupType.Danger, err.response?.data || err.message);
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

  return (
    <>
      <div className="planel shadow-md flex-col flex justify-center bg-white rounded-md p-4">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-3xl">Stanovi</h1>
          <RequireRole roles={["Company"]}>
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setIsOpenAdd(true);
                setEditApartment({} as Apartment);
              }}
            >
              + Dodaj stanove
            </button>
          </RequireRole>
        </div>

        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-10">
          <ul className="flex flex-wrap -mb-px">
            {Array.from({ length: floorCount }, (_, i) => i + 1).map(floor => (
              <li key={floor} className="me-2">
                <button
                  onClick={() => {
                    setActiveFloor(floor);
                    setOpenMenuIndex(null);
                  }}
                  className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                    activeFloor === floor
                      ? "text-primary border-primary"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 "
                  }`}
                >
                  Sprat
                  {" "}
                  {floor}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {apartments && apartments.length
          ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {apartments.filter(item => item.floor === activeFloor).map((item, index) => (
                  <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col relative">
                    <RequireRole roles={["Company"]}>
                      <button
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                        onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </RequireRole>

                    {openMenuIndex === index && (
                      <div className="absolute top-10 right-2 bg-white border border-gray-200 rounded-md shadow-md w-32 z-10">
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                          onClick={() => {
                            setOpenMenuIndex(null);
                            setEditApartment(item);
                            setIsOpenAdd(true);
                          }}
                        >
                          <PenLine size={18} className="mr-2" />
                          Izmeni
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100  flex items-center"
                          onClick={() => {
                            setOpenMenuIndex(null);
                            setIsOpenDelete(true);
                            setSelectedApartment(item);
                          }}
                        >
                          <Trash size={18} className="mr-2" />
                          Izbriši
                        </button>
                      </div>
                    )}
                    <div className="mb-2">
                      <span className="font-bold whitespace-nowrap">Broj stana: </span>
                      {item.apartmentNumber}
                    </div>
                    <div className="mb-2">
                      <span className="font-bold whitespace-nowrap">Površina stana: </span>
                      {item.area}
                    </div>
                    <div className="mb-5">
                      <span className="font-bold whitespace-nowrap">Status stana: </span>
                      <span className={`${item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>{item.isAvailable ? "Slobodan" : "Zauzet"}</span>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setSelectedApartment(item);
                        setIsOpen(true);
                      }}
                    >
                      Više
                    </button>
                  </div>
                ))}
              </div>
            )
          : <span>Zgrada ne sadrži stanove</span>}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Detalji stana"
        footer={false}
      >
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Broj stana: </span>
            {selectedApartment?.apartmentNumber}
          </div>
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Sprat: </span>
            {selectedApartment?.floor}
          </div>
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Površina stana: </span>
            {selectedApartment?.area}
          </div>
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Broj soba: </span>
            {selectedApartment?.roomCount}
          </div>
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Broj terasa: </span>
            {selectedApartment?.balconyCount}
          </div>
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Orijentacija: </span>
            {getOrientationLabel(selectedApartment?.orientation)}
          </div>
          <div className="mb-2">
            <span className="font-bold whitespace-nowrap">Status: </span>
            <span className={`${selectedApartment?.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>{selectedApartment?.isAvailable ? "Slobodan" : "Zauzet"}</span>
          </div>
        </div>
      </Modal>

      <CreateApartmentModal existingApartment={editApartment} isOpen={isOpenAdd} setIsOpen={setIsOpenAdd} floorCount={floorCount} buildingId={buildingId} setReload={setReload} />

      <Modal isOpen={isOpenDelete} onClose={() => setIsOpenDelete(false)} title="Brisanje zgrade" onConfirm={handleDelete} loading={loading}>
        <div>
          <p>Da li ste sigurni da želite da izbrišete ovaj stan?</p>
        </div>
      </Modal>
    </>
  );
}
