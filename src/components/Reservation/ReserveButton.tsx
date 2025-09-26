import { useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Apartment } from "../../types/apartment";
import { Bookmark } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import { createReservation } from "../../services/reservationService";
import type { ReservationToAdd } from "../../types/reservation";
import { PopupType, useToast } from "../../hooks/useToast";
import { handleError } from "../../utils/handleError";

interface Props {
  apartment: Apartment;
  setReload: Dispatch<SetStateAction<boolean>>;
}

export default function ReserveButton({ apartment, setReload }: Props) {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  const { showToast } = useToast();

  const handleReserve = async () => {
    try {
      setLoading(true);
      await createReservation({ userId: user.id, apartmentId: apartment.id } as ReservationToAdd);
      showToast(PopupType.Success, "Uspešno ste rezervisali stan na narednih 5 dana");
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
    <button className="btn btn-info flex gap-2" disabled={apartment.reservation !== null} onClick={handleReserve}>
      <Bookmark />
      {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : apartment.reservation !== null ? "Rezervisano" : "Rezerviši"}
    </button>
  );
}
