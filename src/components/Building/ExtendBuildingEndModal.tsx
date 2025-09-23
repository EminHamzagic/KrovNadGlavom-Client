import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Building, BuildingEndDateToExtend } from "../../types/building";
import Modal from "../Modal";
import { PopupType, useToast } from "../../hooks/useToast";
import DatePicker from "react-datepicker";
import { extendBuildingEndDate } from "../../services/buildingService";
import axios from "axios";

interface Props {
  building: Building;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setReload: Dispatch<SetStateAction<boolean>>;
}

export default function ExtendBuildingEndModal({ building, isOpen, setIsOpen, setReload }: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  const [extendedDate, setExtendedDate] = useState<Date>(new Date(building.endDate));

  const { showToast } = useToast();

  const handleConfirm = async () => {
    if (extendedDate < new Date(building.endDate)) {
      showToast(PopupType.Danger, "Datum produžetka ne može biti manji od prvobitnog datuma završetka zgrade");
      return;
    }

    try {
      setLoading(true);
      await extendBuildingEndDate({ extendedUntil: extendedDate.toISOString() } as BuildingEndDateToExtend, building.id);

      showToast(PopupType.Success, "Uspešno ste se produžili datum završetka igradnje zgrade");
      setIsOpen(false);
      setReload(prev => !prev);
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        showToast(PopupType.Danger, err.response?.data);
      }
      else {
        showToast(PopupType.Danger, `Unkown error: ${err}`);
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Produži datum završetka izgradnje" size="xl" onConfirm={handleConfirm} loading={loading}>
      <div className="flex flex-col">
        <label className="form-label">Datum produženja završetka izgradnje:</label>
        <DatePicker
          selected={extendedDate}
          onChange={(date: Date | null) => {
            if (date) {
              setExtendedDate(date);
            }
          }}
          className="form-input w-full"
          wrapperClassName="w-full"
          dateFormat="dd.MM.yyyy"
        />
      </div>
    </Modal>
  );
}
