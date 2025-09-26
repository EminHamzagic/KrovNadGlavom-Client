import { useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { DiscountRequest, DiscountRequestToUpdate } from "../../types/discountRequest";
import { StatusEnum } from "../../types/agencyRequest";
import Modal from "../Modal";
import { CircleQuestionMark, MoreVertical, Trash } from "lucide-react";
import { Link } from "react-router";
import { handleError } from "../../utils/handleError";
import { deleteDiscountRequest, forwardDiscountRequest, updateDiscountRequest } from "../../services/discountRequestService";
import { PopupType, useToast } from "../../hooks/useToast";
import { UserContext } from "../../context/UserContext";
import Tooltip from "../Tooltip";

interface Props {
  request: DiscountRequest;
  setReload: Dispatch<SetStateAction<boolean>>;
}

const statusConfig: Record<
	string,
	{ text: string; className: string }
> = {
  [StatusEnum.Pending]: {
    text: "Na čekanju",
    className: "bg-yellow-100 text-yellow-800",
  },
  [StatusEnum.Approved]: {
    text: "Odobreno",
    className: "bg-green-100 text-green-800",
  },
  [StatusEnum.Rejected]: {
    text: "Odbijeno",
    className: "bg-red-100 text-red-800",
  },
};

export default function DiscountRequestCard({ request, setReload }: Props) {
  const [isOpenReject, setIsOpenReject] = useState<boolean>(false);
  const [isOpenAccept, setIsOpenAccept] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [isOpenForward, setIsOpenForward] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<DiscountRequestToUpdate>({
    status: StatusEnum.Pending,
    rejectReason: "",
    reason: request.reason,
  });

  const { showToast } = useToast();
  const { getUserType } = useContext(UserContext);
  const cfg = statusConfig[request.status];

  const handleReject = async () => {
    const sendData = {
      ...updateData,
      reason: request.reason,
      status: StatusEnum.Rejected,
    } as DiscountRequestToUpdate;

    try {
      setLoading(true);
      await updateDiscountRequest(request.id, sendData);
      showToast(PopupType.Success, "Uspšno ste odbili zahtev");
      setReload(prev => !prev);
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteDiscountRequest(request.id);
      showToast(PopupType.Success, "Uspšno ste izbrisali zahtev zahtev");
      setReload(prev => !prev);
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    const sendData = {
      rejectReason: "",
      reason: request.reason,
      status: StatusEnum.Approved,
    } as DiscountRequestToUpdate;

    try {
      setLoading(true);
      await updateDiscountRequest(request.id, sendData);
      showToast(PopupType.Success, "Uspšno ste prihvatili zahtev");
      setReload(prev => !prev);
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleFowrad = async () => {
    try {
      setLoading(true);
      await forwardDiscountRequest(request.id);
      showToast(PopupType.Success, "Uspšno ste prosledili zahtev");
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
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-3 gap-2 relative">
      {request.status === "Rejected" && (
        <button
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsOpenMenu(prev => !prev)}
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {isOpenMenu && (
        <div className="absolute top-10 right-2 bg-white border border-gray-200 rounded-md shadow-md w-32 z-10">
          <button
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100  flex items-center"
            onClick={() => {
              setIsOpenDelete(true);
            }}
          >
            <Trash size={18} className="mr-2" />
            Izbriši
          </button>
        </div>
      )}

      <div className="col-span-3 flex flex-col">
        <span
          className={`${cfg.className} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm w-fit`}
        >
          {cfg.text}
        </span>
        {getUserType() === "Company" && (
          <div className="text-gray-500 flex gap-2 mt-2">
            <span>Agencija:</span>
            <Link to={`/agency/${request.agencyId}`} className="text-primary hover:underline">{request.agency.name}</Link>
          </div>
        )}
        {(getUserType() === "Agency" || getUserType() === "Company") && (
          <div className="text-gray-500 flex gap-2 mt-2">
            <span>Korisnik:</span>
            <span>{`${request.user.name} ${request.user.lastname}`}</span>
          </div>
        )}
        {getUserType() === "User" && (
          <div className="text-gray-500 flex gap-2 mt-2">
            <span>Agencija:</span>
            <Link to={`/agency/${request.agencyId}`} className="text-primary hover:underline">{request.agency.name}</Link>
          </div>
        )}
        <div className="text-gray-500 flex gap-2 mt-2">
          <span>Stan:</span>
          <Link to={`/apartments/${request.apartmentId}`} className="text-primary hover:underline">Vidi</Link>
        </div>
        <div className="text-gray-500 flex gap-2 mt-2">
          <span>Procenat popusta:</span>
          <span>
            {request.percentage}
            %
          </span>
        </div>
        {request.reason && (
          <div className="text-gray-500 flex gap-2 mt-2">
            <span>Razlog za popust:</span>
            <Tooltip position="top" text={request.reason}>
              <div className="cursor-pointer">
                <CircleQuestionMark size={20} />
              </div>
            </Tooltip>
          </div>
        )}
        {request.rejectReason && (
          <div className="text-gray-500 flex gap-2 mt-2">
            <span>Razlog odbijanja:</span>
            <Tooltip position="top" text={request.rejectReason}>
              <div className="cursor-pointer">
                <CircleQuestionMark size={20} />
              </div>
            </Tooltip>
          </div>
        )}

      </div>
      {request.status === StatusEnum.Pending && (getUserType() === "Company" || (getUserType() === "Agency" && !request.constructionCompanyId)) && (
        <div className="col-span-3 mt-2 grid grid-cols-2 gap-5 w-full">
          <button
            className="btn btn-danger w-full"
            onClick={() => {
              setIsOpenReject(true);
              setUpdateData({ status: StatusEnum.Pending, rejectReason: "" });
            }}
          >
            Odbij
          </button>
          {request.mustForward && !request.constructionCompanyId
            ? (
                <Tooltip text="Zahtev za popust se mora proslediti kompaniji jer je procenat popusta veći od vaše provizije">
                  <button className="btn btn-primary w-full whitespace-nowrap" onClick={() => setIsOpenForward(true)}>Prosledi</button>
                </Tooltip>
              )
            : <button className="btn btn-success w-full" onClick={() => setIsOpenAccept(true)}>Prihvati</button>}
        </div>
      )}

      <Modal isOpen={isOpenReject} onClose={() => setIsOpenReject(false)} title="Odbij zahtev" size="xl" loading={loading} onConfirm={handleReject}>
        <div className="flex flex-col">
          <label>Razlog za odbijanje</label>
          <textarea className="form-input h-30" value={updateData.rejectReason} onChange={e => setUpdateData({ ...updateData, rejectReason: e.target.value })} placeholder="Unesite razlog za odbijanje"></textarea>
        </div>
      </Modal>

      <Modal isOpen={isOpenAccept} onClose={() => setIsOpenAccept(false)} title="Prihvati zahtev" size="xl" loading={loading} onConfirm={handleAccept}>
        <div>
          <h1>Da li ste sigurni da želite da prihvatite ovaj zahtev?</h1>
        </div>
      </Modal>

      <Modal isOpen={isOpenDelete} onClose={() => setIsOpenDelete(false)} title="Brisanje zahteva" size="xl" loading={loading} onConfirm={handleDelete}>
        <div>
          <h1>Da li ste sigurni da želite da izbrišete ovaj zahtev?</h1>
        </div>
      </Modal>

      <Modal isOpen={isOpenForward} onClose={() => setIsOpenForward(false)} title="Prosleđivanje zahteva" size="xl" confirmText="Prosledi" loading={loading} onConfirm={handleFowrad}>
        <div>
          <h1>Da li ste sigurni da želite da prosledite ovaj zahtev kompaniji?</h1>
          <h1>Nakon prosleđivanja, kompanija preuzima potpunu slobodu o tome hoće li prihvatiti zahtev.</h1>
        </div>
      </Modal>
    </div>
  );
}
