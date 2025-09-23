import { useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Building } from "../../types/building";
import { UserContext } from "../../context/UserContext";
import Modal from "../Modal";
import { PopupType, useToast } from "../../hooks/useToast";
import { createAgencyRequest } from "../../services/agencyRequestService";
import { StatusEnum } from "../../types/agencyRequest";
import type { AgencyRequestToAdd } from "../../types/agencyRequest";
import axios from "axios";
import { Hourglass, Send } from "lucide-react";

interface Props {
  building: Building;
  setReload: Dispatch<SetStateAction<boolean>>;
}

export default function SendRequestButtonModal({ building, setReload }: Props) {
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);

  const { showToast } = useToast();

  const handleSend = async () => {
    if (percentage <= 0 || percentage > 100) {
      showToast(PopupType.Danger, "Procenat provizije nije validan");
      return;
    }

    const data = {
      agencyId: user.agencyId,
      buildingId: building.id,
      commissionPercentage: percentage,
    } as AgencyRequestToAdd;

    try {
      setLoading(true);
      await createAgencyRequest(data);
      showToast(PopupType.Success, "Zahtev je uspešno poslat");
      setReload(prev => !prev);
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        showToast(PopupType.Danger, err.response?.data || err);
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
    <div>
      {(building.requestStatus !== StatusEnum.Approved && building.requestStatus !== StatusEnum.Pending) && (
        <button className="btn btn-primary flex gap-2 items-center" onClick={() => setIsOpen(true)}>
          <Send size={20} />
          {" "}
          Pošalji zahtev
        </button>
      )}
      {building.requestStatus === StatusEnum.Pending && (
        <button className="btn btn-primary flex gap-2 items-center" disabled={true}>
          <Hourglass size={20} />
          {" "}
          Na čekanju
        </button>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Slanje zahteva" onConfirm={handleSend} confirmText="Pošalji" loading={loading}>
        <div className="flex flex-col">
          <label>Procenat provizije</label>
          <div className="flex">
            <input type="text" className="form-input rounded-r-none" value={percentage} onChange={e => setPercentage(Number(e.target.value))} />
            <div className="flex items-center justify-center border border-[#e0e6ed] bg-[#eee] px-3 font-semibold rounded-r-md">%</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
