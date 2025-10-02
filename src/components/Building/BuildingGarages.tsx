import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Garage, GarageToAdd } from "../../types/garage";
import type { Apartment } from "../../types/apartment";
import Modal from "../Modal";
import { CircleX } from "lucide-react";
import { updateGarage } from "../../services/garageService";
import { PopupType, useToast } from "../../hooks/useToast";
import { handleError } from "../../utils/handleError";

interface Props {
  garages: Garage[];
  apartments: Apartment[];
  setReload: Dispatch<SetStateAction<boolean>>;
}

export default function BuildingGarages({ garages, setReload, apartments }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGarage, setSelectedGarage] = useState<Garage>({} as Garage);
  const [selectedApartmentId, setSelectedApartmentId] = useState<string>("");

  const { showToast } = useToast();

  const handleEditClick = (garage: Garage) => {
    setSelectedGarage(garage);
    setSelectedApartmentId("");
    setIsOpen(true);
  };

  const handleUnassignApartment = async (garage: Garage) => {
    const updateData = {
      ...garage,
      apartmentId: "",
    } as GarageToAdd;

    try {
      setLoading(true);
      await updateGarage(updateData, garage.id);

      showToast(PopupType.Success, "Stan je uspešno uklonjen");
      setSelectedApartmentId("");
      setReload(prev => !prev);
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    const updateData = {
      ...selectedGarage,
      apartmentId: selectedApartmentId,
    } as GarageToAdd;

    try {
      setLoading(true);
      await updateGarage(updateData, selectedGarage.id);

      showToast(PopupType.Success, "Garaža je uspešno ažurirana");
      setSelectedApartmentId("");
      setReload(prev => !prev);
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col mb-5">
        <h1 className="text-3xl">Garaže</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-5">
          {garages.map((item, index) => (
            <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col relative">
              <span className="text-primary-dark-light text-xl mb-3">{item.spotNumber}</span>
              <div className="flex gap-3">
                Stan:
                {item.apartmentId
                  ? (
                      <div className="flex gap-2 items-center">
                        <span> Dodeljen</span>
                        <button className="cursor-pointer" onClick={() => handleUnassignApartment(item)}><CircleX size={18} color="red" /></button>
                      </div>
                    )
                  : " Nema"}
              </div>
              <button className="btn btn-primary py-1 px-3 mt-5" onClick={() => handleEditClick(item)}>Izmeni</button>
            </div>
          ))}
        </div>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Izaberi stan" onConfirm={handleEdit} confirmText="Dodeli" loading={loading}>
          <div className="flex flex-col gap-4">
            <div>
              <label>Broj garažnog mesta</label>
              <input type="text" className="form-input" value={selectedGarage?.spotNumber} onChange={e => setSelectedGarage({ ...selectedGarage, spotNumber: e.target.value })} />
            </div>

            <select
              className="form-input"
              value={selectedApartmentId}
              onChange={e => setSelectedApartmentId(e.target.value)}
            >
              <option value="">-- Izaberi stan --</option>
              {apartments.map(ap => (
                <option key={ap.id} value={ap.id}>
                  {ap.apartmentNumber}
                </option>
              ))}
            </select>
          </div>
        </Modal>
      </div>
    </>
  );
}
