import { useEffect, useState } from "react";
import type { Reservation } from "../types/reservation";
import { deleteReservation, getReservation } from "../services/reservationService";
import { handleError } from "../utils/handleError";
import FullScreenLoader from "../components/FullScreenLoader";
import { Bookmark } from "lucide-react";
import { formatDate } from "../utils/dateFormatter";
import { useNavigate } from "react-router";
import Modal from "../components/Modal";
import { PopupType, useToast } from "../hooks/useToast";

export default function ReservationsPage() {
  const [reservation, setReservation] = useState<Reservation>({} as Reservation);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        const data = await getReservation();
        setReservation(data);
      }
      catch (err) {
        handleError(err);
      }
      finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reload]);

  const handleDelte = async () => {
    try {
      setLoadingModal(true);
      await deleteReservation(reservation.id);
      showToast(PopupType.Success, "Rezervacija je uspešno otkazana");
      setIsOpen(false);
      setReload(!reload);
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoadingModal(false);
    }
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="planel flex-col shadow-md flex bg-white rounded-md p-4">
      <h1 className="text-3xl">Rezervacije</h1>

      <div className="mt-10">
        {reservation
          ? (
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-2 relative">
                <div className="flex items-center">
                  <Bookmark color="#c7671e" size={80} />
                </div>

                <div className="flex items-center text-gray-500">
                  <p>
                    Od
                    {" "}
                    {formatDate(reservation.fromDate)}
                  </p>
                </div>
                <div className="flex items-center text-gray-500">
                  <p>
                    Do
                    {" "}
                    {formatDate(reservation.toDate)}
                  </p>
                </div>

                <div className="flex flex-col gap-5">
                  <button className="btn btn-danger" onClick={() => setIsOpen(true)}>Otkaži</button>
                  <button className="btn btn-primary" onClick={() => navigate(`/apartments/${reservation.apartmentId}`)}>Detalji</button>
                </div>
              </div>
            )
          : <p>Nema rezervacija</p>}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Otazivanje rezervacije" onConfirm={handleDelte} loading={loadingModal}>
        <div>
          <p>Da li ste sigurni da želite da otkažete ovu rezervaciju?</p>
        </div>
      </Modal>
    </div>
  );
}
