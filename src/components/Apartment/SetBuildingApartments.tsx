import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { ApartmentToAdd } from "../../types/apartment";
import Modal from "../Modal";
import { getOrientationLabel, OrientationEnum } from "../../utils/orientation";
import { PopupType, useToast } from "../../hooks/useToast";
import { MoreVertical, PenLine, Trash } from "lucide-react";

interface Props {
  floorCount: number;
  buildingApartments: ApartmentToAdd[];
  setBuildingApartments: Dispatch<SetStateAction<ApartmentToAdd[]>>;
}

export default function SetBuildingApartments({ floorCount, buildingApartments, setBuildingApartments }: Props) {
  const [apartment, setApartment] = useState<ApartmentToAdd>({
    id: "",
    buildingId: "",
    apartmentNumber: "",
    area: 0,
    roomCount: 0,
    balconyCount: 0,
    orientation: OrientationEnum.North,
    floor: 1,
    isAvailable: true,
  });
  const [activeFloor, setActiveFloor] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [multiFloor, setMultiFloor] = useState<boolean>(false);
  const [perFloor, setPerFloor] = useState<number>(1);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { showToast } = useToast();

  const handleChange = (key: keyof ApartmentToAdd, value: any) => {
    setApartment(prev => ({
      ...prev,
      [key]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [key]: "",
    }));
  };

  const validateApartmentData = (data: ApartmentToAdd) => {
    const newErrors: Record<string, string> = {};

    if (!data.apartmentNumber.trim())
      newErrors.apartmentNumber = "Broj stana je obavezan";
    if (data.apartmentNumber.trim().length > 15)
      newErrors.apartmentNumber = "Broj stana ne može biti duži od 15 karaktera";
    if (!data.area || data.area <= 0)
      newErrors.area = "Površina mora biti veća od 0";
    if (!data.floor || data.floor <= 0)
      newErrors.floor = "Sprat mora biti izabran";
    if (!data.roomCount || data.roomCount < 0)
      newErrors.roomCount = "Broj soba ne može biti negativan";
    if (!data.balconyCount || data.balconyCount < 0)
      newErrors.balconyCount = "Broj terasa ne može biti negativan";
    if (!data.orientation.trim())
      newErrors.orientation = "Orijentacija stana je obavezna";

    return newErrors;
  };

  const handleDelete = (id: string) => {
    setBuildingApartments(prev =>
      prev.filter(item => item.id !== id),
    );
  };

  const handleAdd = () => {
    const validationErrors = validateApartmentData(apartment);

    if (Object.keys(validationErrors).length > 0) {
      showToast(PopupType.Danger, "Nevalidni podaci, molimo vas ponovo proverite");
      setErrors(validationErrors);
      return;
    }

    if (isEditing && editingId !== null) {
      setBuildingApartments(prev =>
        prev.map(item => (item.id === editingId ? apartment : item)),
      );
      setIsEditing(false);
      setEditingId(null);
      setIsOpen(false);
      return;
    }

    if (multiFloor) {
      const newApartments: ApartmentToAdd[] = [];

      for (let floor = 1; floor <= floorCount; floor++) {
        for (let i = 1; i <= perFloor; i++) {
          newApartments.push({
            ...apartment,
            id: crypto.randomUUID(),
            floor,
            apartmentNumber: `${apartment.apartmentNumber}-${floor}-${i}`,
          });
        }
      }

      setBuildingApartments([...buildingApartments, ...newApartments]);
    }
    else {
      setBuildingApartments([...buildingApartments, { ...apartment, id: crypto.randomUUID() }]);
    }

    setIsOpen(false);
  };

  return (
    <div className="flex flex-col min-h-96">
      <p className="text-2xl">Stanovi</p>
      <p
        className="text-gray-500 hover:underline cursor-pointer mt-5 w-fit"
        onClick={() => {
          setIsOpen(true);
          setErrors({});
          setApartment({
            id: "",
            buildingId: "",
            apartmentNumber: "",
            area: 0,
            roomCount: 0,
            balconyCount: 0,
            orientation: OrientationEnum.North,
            floor: 1,
            isAvailable: true,
          });
          setPerFloor(1);
          setMultiFloor(false);
        }}
      >
        + Dodaj Stanove
      </p>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
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
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-5">
          {buildingApartments.filter(item => item.floor === activeFloor).map((item, index) => (
            <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col relative">
              <button
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {openMenuIndex === index && (
                <div className="absolute top-10 right-2 bg-white border border-gray-200 rounded-md shadow-md w-32 z-10">
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                    onClick={() => {
                      setOpenMenuIndex(null);
                      setEditingId(item.id);
                      setIsEditing(true);
                      setApartment(item);
                      setIsOpen(true);
                    }}
                  >
                    <PenLine size={18} className="mr-2" />
                    Izmeni
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100  flex items-center"
                    onClick={() => {
                      setOpenMenuIndex(null);
                      handleDelete(item.id);
                    }}
                  >
                    <Trash size={18} className="mr-2" />
                    Izbriši
                  </button>
                </div>
              )}
              <span className="text-primary-dark-light text-xl mb-3">{item.apartmentNumber}</span>
              <span>
                Površina:
                {" "}
                {item.area}
                m²
              </span>
              <span>
                Broj soba:
                {" "}
                {item.roomCount}
              </span>
              <span>
                Broj terasa:
                {" "}
                {item.balconyCount}
              </span>
              <span>
                Orijentacija:
                {" "}
                {getOrientationLabel(item.orientation)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Dodaj stanove" size="2xl" onConfirm={handleAdd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className={`col-span-1 ${errors.apartmentNumber && "has-error"}`}>
            <label className="form-label">Broj stana:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Unesite broj stana"
              value={apartment.apartmentNumber}
              onChange={e => handleChange("apartmentNumber", e.target.value)}
            />
            {errors.apartmentNumber && (
              <p className="text-danger text-sm mt-1">{errors.apartmentNumber}</p>
            )}
          </div>
          <div className={`col-span-1 ${errors.floor && "has-error"}`}>
            <label className="form-label">Sprat:</label>
            <select
              className="form-input"
              value={apartment.floor}
              onChange={e => handleChange("floor", e.target.value)}
            >
              {Array.from({ length: floorCount }, (_, i) => i + 1).map(floor => (
                <option key={floor} value={floor}>
                  {floor}
                </option>
              ))}
            </select>
            {errors.floor && (
              <p className="text-danger text-sm mt-1">{errors.floor}</p>
            )}
          </div>

          <div className={`col-span-1 ${errors.area && "has-error"}`}>
            <label className="form-label">Površina:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Unesite površinu stana"
              value={apartment.area}
              onChange={e => handleChange("area", Number.parseInt(e.target.value) || 0)}
            />
            {errors.area && (
              <p className="text-danger text-sm mt-1">{errors.area}</p>
            )}
          </div>
          <div className={`col-span-1 ${errors.orientation && "has-error"}`}>
            <label className="form-label">Orijentacija:</label>
            <select
              className="form-input"
              value={apartment.orientation}
              onChange={e => handleChange("orientation", e.target.value)}
            >
              <option value="">Izaberite orijentaciju</option>
              {Object.values(OrientationEnum).map(orientation => (
                <option key={orientation} value={orientation}>
                  {getOrientationLabel(orientation)}
                </option>
              ))}
            </select>
            {errors.orientation && (
              <p className="text-danger text-sm mt-1">{errors.orientation}</p>
            )}
          </div>

          <div className={`col-span-1 ${errors.roomCount && "has-error"}`}>
            <label className="form-label">Broj soba:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Unesite broj soba stana"
              value={apartment.roomCount}
              onChange={e => handleChange("roomCount", Number.parseInt(e.target.value) || 0)}
            />
            {errors.roomCount && (
              <p className="text-danger text-sm mt-1">{errors.roomCount}</p>
            )}
          </div>
          <div className={`col-span-1 ${errors.balconyCount && "has-error"}`}>
            <label className="form-label">Broj terasa:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Unesite broj terasa stana"
              value={apartment.balconyCount}
              onChange={e => handleChange("balconyCount", Number.parseInt(e.target.value) || 0)}
            />
            {errors.balconyCount && (
              <p className="text-danger text-sm mt-1">{errors.balconyCount}</p>
            )}
          </div>

          {!isEditing && (
            <div>
              <label className="flex itmes-center">
                <input type="checkbox" className="form-checkbox" checked={multiFloor} onChange={e => setMultiFloor(e.target.checked)} />
                Dodaj ovaj stan na sve spratove
              </label>
              <p className="mt-3">Broj stanova po spratu</p>
              <div className="flex">
                <button
                  className="btn btn-primary p-1 px-3"
                  onClick={() => {
                    if (perFloor > 1)
                      setPerFloor(perFloor - 1);
                  }}
                >
                  -
                </button>
                <div className="border-2 border-gray-300 px-3 rounded-md mx-1 flex items-center justify-center">{perFloor}</div>
                <button className="btn btn-primary p-1 px-3" onClick={() => setPerFloor(perFloor + 1)}>+</button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
