import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { GarageToAdd } from "../../types/garage";
import Modal from "../Modal";
import type { ApartmentToAdd } from "../../types/apartment";
import { CircleX } from "lucide-react";

interface Props {
  garagesCount: number;
  builindgGarages: GarageToAdd[];
  apartments: ApartmentToAdd[];
  setBuildingGarages: Dispatch<SetStateAction<GarageToAdd[]>>;
}

export default function SetBuildingGarages({ garagesCount, builindgGarages, setBuildingGarages, apartments }: Props) {
  const [garages, setGarages] = useState<GarageToAdd[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedGarageIndex, setSelectedGarageIndex] = useState<number | null>(
    null,
  );
  const [selectedApartmentId, setSelectedApartmentId] = useState<string>("");

  useEffect(() => {
    if (builindgGarages.length === 0) {
      const garagesTemp = [] as GarageToAdd[];
      for (let i = 1; i <= garagesCount; i++) {
        garagesTemp.push({
          buildingId: "",
          apartmentId: "",
          spotNumber: `Garaža-${i}`,
          isAvailable: true,
        });
      }
      setGarages(garagesTemp);
      setBuildingGarages(garagesTemp);
    }
    else if (builindgGarages.length > 0 && builindgGarages.length !== garagesCount) {
      const garagesTemp = [] as GarageToAdd[];
      for (let i = 1; i <= garagesCount; i++) {
        garagesTemp.push({
          buildingId: "",
          apartmentId: "",
          spotNumber: `Garaža-${i}`,
          isAvailable: true,
        });
      }
      setGarages(garagesTemp);
      setBuildingGarages(garagesTemp);
    }
    else {
      setGarages(builindgGarages);
    }
  }, []);

  const handleAssignClick = (index: number) => {
    setSelectedGarageIndex(index);
    setSelectedApartmentId("");
    setIsOpen(true);
  };

  const handleAssignApartment = () => {
    if (selectedGarageIndex === null || !selectedApartmentId)
      return;

    const updatedGarages = [...garages];
    updatedGarages[selectedGarageIndex] = {
      ...updatedGarages[selectedGarageIndex],
      apartmentId: selectedApartmentId,
    };

    setGarages(updatedGarages);
    setBuildingGarages(updatedGarages);

    setIsOpen(false);
    setSelectedGarageIndex(null);
    setSelectedApartmentId("");
  };

  const handleUnassignApartment = (index: number) => {
    const updatedGarages = [...garages];
    updatedGarages[index] = {
      ...updatedGarages[index],
      apartmentId: "",
    };

    setGarages(updatedGarages);
    setBuildingGarages(updatedGarages);
  };

  return (
    <div className="flex flex-col min-h-96">
      <p className="text-2xl">Garaže</p>

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
                      <button className="cursor-pointer" onClick={() => handleUnassignApartment(index)}><CircleX size={18} color="red" /></button>
                    </div>
                  )
                : <button className="btn btn-primary py-1 px-3" onClick={() => handleAssignClick(index)}>Dodeli</button>}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Izaberi stan" onConfirm={handleAssignApartment} disabled={!selectedApartmentId} confirmText="Dodeli">
        <div className="flex flex-col gap-4">
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
  );
}
