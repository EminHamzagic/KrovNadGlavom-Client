import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Apartment, ApartmentToAdd, MultipleApartmentsToAdd } from "../../types/apartment";
import Modal from "../Modal";
import { getOrientationLabel, OrientationEnum } from "../../utils/orientation";
import { PopupType, useToast } from "../../hooks/useToast";
import { createApartment, createMultipleApartment, editApartment } from "../../services/apartmentService";
import { handleError } from "../../utils/handleError";

interface Props {
  floorCount: number;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  buildingId: string;
  setReload: Dispatch<SetStateAction<boolean>>;
  existingApartment?: Apartment;
}

export default function CreateApartmentModal({ floorCount, isOpen, setIsOpen, buildingId, setReload, existingApartment }: Props) {
  const [apartment, setApartment] = useState<ApartmentToAdd>({
    id: existingApartment?.id ?? crypto.randomUUID(),
    buildingId,
    apartmentNumber: existingApartment?.apartmentNumber ?? "",
    area: existingApartment?.area ?? 0,
    roomCount: existingApartment?.roomCount ?? 0,
    balconyCount: existingApartment?.balconyCount ?? 0,
    orientation: (existingApartment?.orientation as OrientationEnum) ?? OrientationEnum.North,
    floor: existingApartment?.floor ?? 1,
    isAvailable: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [multiFloor, setMultiFloor] = useState<boolean>(false);
  const [perFloor, setPerFloor] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (existingApartment) {
      setApartment({
        id: existingApartment.id ?? crypto.randomUUID(),
        buildingId,
        apartmentNumber: existingApartment.apartmentNumber ?? "",
        area: existingApartment.area ?? 0,
        roomCount: existingApartment.roomCount ?? 0,
        balconyCount: existingApartment.balconyCount ?? 0,
        orientation: (existingApartment.orientation as OrientationEnum) ?? OrientationEnum.North,
        floor: existingApartment.floor ?? 1,
        isAvailable: true,
      });
    }
    else {
      setApartment({
        id: crypto.randomUUID(),
        buildingId,
        apartmentNumber: "",
        area: 0,
        roomCount: 0,
        balconyCount: 0,
        orientation: OrientationEnum.North,
        floor: 1,
        isAvailable: true,
      });
    }
  }, [existingApartment, buildingId]);

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

  const handleEdit = async () => {
    try {
      setLoading(true);
      await editApartment(apartment);

      showToast(PopupType.Success, "Stan je uspešno izmenjen");
      setReload(prev => !prev);
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const validationErrors = validateApartmentData(apartment);

    if (Object.keys(validationErrors).length > 0) {
      showToast(PopupType.Danger, "Nevalidni podaci, molimo vas ponovo proverite");
      setErrors(validationErrors);
      return;
    }

    if (existingApartment?.id) {
      await handleEdit();
    }
    else {
      try {
        setLoading(true);
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

          await createMultipleApartment({ apartments: newApartments } as MultipleApartmentsToAdd);
          setReload(prev => !prev);
          showToast(PopupType.Success, "Stanovi su uspešno dodati");
        }
        else {
          await createApartment(apartment);
          setReload(prev => !prev);
          showToast(PopupType.Success, "Stan je uspešno dodat");
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

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Dodaj stanove" size="2xl" onConfirm={handleAdd} loading={loading}>
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

        {!existingApartment?.id && (
          <div>
            <label className="flex itmes-center">
              <input type="checkbox" className="form-checkbox" checked={multiFloor} onChange={e => setMultiFloor(e.target.checked)} />
              Dodaj ovaj stan na sve spratove
            </label>
            {multiFloor
              && (
                <>
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
                </>
              )}
          </div>
        )}
      </div>
    </Modal>
  );
}
