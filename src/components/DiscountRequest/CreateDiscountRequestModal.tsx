import { useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Modal from "../Modal";
import type { DiscountRequestToAdd } from "../../types/discountRequest";
import type { Apartment } from "../../types/apartment";
import { UserContext } from "../../context/UserContext";
import { createDiscountRequest } from "../../services/discountRequestService";
import { handleError } from "../../utils/handleError";
import { PopupType, useToast } from "../../hooks/useToast";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  apartment: Apartment;
  setReload: Dispatch<SetStateAction<boolean>>;
}

export default function CreateDiscountRequestModal({ apartment, isOpen, setIsOpen, setReload }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useContext(UserContext);
  const [requestData, setRequestData] = useState<DiscountRequestToAdd>({
    userId: user.id,
    agencyId: apartment.agency?.id ?? "",
    apartmentId: apartment.id,
    percentage: 0,
    reason: "",
  });

  const { showToast } = useToast();

  const handleSendDiscountRequest = async () => {
    if (requestData.percentage === 0 || !requestData.reason.trim()) {
      showToast(PopupType.Danger, "Nevalidni podaci, molimo vas proverite podatke");
      return;
    }
    try {
      setLoading(true);
      await createDiscountRequest(requestData);
      showToast(PopupType.Success, "Uspešno ste poslali zahtev za popust");
      setRequestData({ ...requestData, percentage: 0, reason: "" });
      setIsOpen(false);
      setReload(prev => !prev);
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleOnClose = () => {
    setIsOpen(false);
    setRequestData({ ...requestData, percentage: 0 });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} title="Pošalji zahtev za popust" onConfirm={handleSendDiscountRequest} size="xl" loading={loading}>
      <div>
        <div className="mb-2">
          <label>Unesite procentulani iznos popusta:</label>
          <div className="flex">
            <input type="text" className="form-input rounded-r-none" value={requestData.percentage} onChange={e => setRequestData({ ...requestData, percentage: Number(e.target.value) || 0 })} />
            <div className="flex items-center justify-center border border-[#e0e6ed] bg-[#eee] px-3 font-semibold rounded-r-md">%</div>
          </div>
        </div>

        <div className="mb-2">
          <label>Razlog za popust:</label>
          <textarea className="form-input h-40" placeholder="Unesite razlog za popust" value={requestData.reason} onChange={e => setRequestData({ ...requestData, reason: e.target.value })}></textarea>
        </div>
      </div>
    </Modal>
  );
}
