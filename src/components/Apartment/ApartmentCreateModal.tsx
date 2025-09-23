import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Apartment, ApartmentToAdd } from "../../types/apartment";
import { getOrientationLabel, OrientationEnum } from "../../utils/orientation";
import Modal from "../Modal";
import { createApartment, editApartment } from "../../services/apartmentService";
import { PopupType, useToast } from "../../hooks/useToast";
import axios from "axios";

interface Props {
  floorCount: number;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  buildingId: string;
  setReload: Dispatch<SetStateAction<boolean>>;
  apartment?: Apartment;
}

export default function ApartmentCreateModal({ floorCount, isOpen, setIsOpen, buildingId, setReload, apartment }: Props) {
  const [apartmentData, setApartmentData] = useState<ApartmentToAdd>({
    id: apartment?.id ?? crypto.randomUUID(),
    buildingId,
    apartmentNumber: apartment?.apartmentNumber ?? "",
    area: apartment?.area ?? 0,
    roomCount: apartment?.roomCount ?? 0,
    balconyCount: apartment?.balconyCount ?? 0,
    orientation: (apartment?.orientation as OrientationEnum) ?? OrientationEnum.North,
    floor: apartment?.floor ?? 1,
    isAvailable: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (apartment) {
      setApartmentData({
        id: apartment.id ?? crypto.randomUUID(),
        buildingId,
        apartmentNumber: apartment.apartmentNumber ?? "",
        area: apartment.area ?? 0,
        roomCount: apartment.roomCount ?? 0,
        balconyCount: apartment.balconyCount ?? 0,
        orientation: (apartment.orientation as OrientationEnum) ?? OrientationEnum.North,
        floor: apartment.floor ?? 1,
        isAvailable: true,
      });
    }
    else {
      setApartmentData({
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
  }, [apartment, buildingId]);

  const handleChange = (key: keyof ApartmentToAdd, value: any) => {
    setApartmentData(prev => ({
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
      await editApartment(apartmentData);

      showToast(PopupType.Success, "Stan je uspešno izmenjen");
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
  };

  const handleAdd = async () => {
    const validationErrors = validateApartmentData(apartmentData);

    if (Object.keys(validationErrors).length > 0) {
      showToast(PopupType.Danger, "Nevalidni podaci, molimo vas ponovo proverite");
      setErrors(validationErrors);
      return;
    }

    if (apartment?.id) {
      await handleEdit();
    }
    else {
      try {
        setLoading(true);
        await createApartment(apartmentData);

        showToast(PopupType.Success, "Stan je uspešno kreiran");
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
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={apartment?.id ? "Izmeni stan" : "Dodaj stan"} confirmText={apartment?.id ? "Izmeni" : "Dodaj"} size="2xl" onConfirm={handleAdd} loading={loading}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className={`col-span-1 ${errors.apartmentNumber && "has-error"}`}>
          <label className="form-label">Broj stana:</label>
          <input
            type="text"
            className="form-input"
            placeholder="Unesite broj stana"
            value={apartmentData.apartmentNumber}
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
            value={apartmentData.floor}
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
            value={apartmentData.area}
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
            value={apartmentData.orientation}
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
            value={apartmentData.roomCount}
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
            value={apartmentData.balconyCount}
            onChange={e => handleChange("balconyCount", Number.parseInt(e.target.value) || 0)}
          />
          {errors.balconyCount && (
            <p className="text-danger text-sm mt-1">{errors.balconyCount}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
