import { Link } from "react-router";
import { StatusEnum } from "../../types/agencyRequest";
import type { AgencyRequest, AgencyRequestToUpdate } from "../../types/agencyRequest";
import Modal from "../../components/Modal";
import { useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { deleteBuildingRequest, updateBuildingRequest } from "../../services/agencyRequestService";
import { PopupType, useToast } from "../../hooks/useToast";
import { CircleQuestionMark, MoreVertical, Trash } from "lucide-react";
import Tooltip from "../../components/Tooltip";
import { UserContext } from "../../context/UserContext";
import { handleError } from "../../utils/handleError";

interface Props {
  request: AgencyRequest;
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

export default function RequestCard({ request, setReload }: Props) {
  const [isOpenReject, setIsOpenReject] = useState<boolean>(false);
  const [isOpenAccept, setIsOpenAccept] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<AgencyRequestToUpdate>({
    status: StatusEnum.Pending,
    rejectionReason: "",
  });

  const { showToast } = useToast();
  const { getUserType } = useContext(UserContext);
  const cfg = statusConfig[request.status];

  const handleReject = async () => {
    const sendData = {
      ...updateData,
      status: StatusEnum.Rejected,
    } as AgencyRequestToUpdate;

    try {
      setLoading(true);
      await updateBuildingRequest(request.id, sendData);
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
      await deleteBuildingRequest(request.id);
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
      rejectionReason: "",
      status: StatusEnum.Approved,
    } as AgencyRequestToUpdate;

    try {
      setLoading(true);
      await updateBuildingRequest(request.id, sendData);
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

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-3 gap-2 relative">
      {request.status === "Rejected" && (
        <button
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsOpenMenu(true)}
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
            <Link to="" className="text-primary hover:underline">{request.agency.name}</Link>
          </div>
        )}
        {getUserType() === "Agency" && (
          <div className="text-gray-500 flex gap-2 mt-2">
            <span>Kompanija:</span>
            <Link to="" className="text-primary hover:underline">{request.company.name}</Link>
          </div>
        )}
        <div className="text-gray-500 flex gap-2 mt-2">
          <span>Zgrada:</span>
          <Link to={`/buildings/${request.buildingId}`} className="text-primary hover:underline">Vidi</Link>
        </div>
        <div className="text-gray-500 flex gap-2 mt-2">
          <span>Procenat provizije:</span>
          <span>
            {request.commissionPercentage}
            %
          </span>
        </div>
        {request.rejectionReason && (
          <div className="text-gray-500 flex gap-2 mt-2">
            <span>Razlog odbijanja:</span>
            <Tooltip position="top" text={request.rejectionReason}>
              <div className="cursor-pointer">
                <CircleQuestionMark size={20} />
              </div>
            </Tooltip>

          </div>
        )}

      </div>
      {request.status === StatusEnum.Pending && getUserType() === "Company" && (
        <div className="col-span-3 mt-2 flex gap-5 w-full">
          <button
            className="btn btn-danger w-full"
            onClick={() => {
              setIsOpenReject(true);
              setUpdateData({ status: StatusEnum.Pending, rejectionReason: "" });
            }}
          >
            Odbij
          </button>
          <button className="btn btn-success w-full" onClick={() => setIsOpenAccept(true)}>Prihvati</button>
        </div>
      )}

      <Modal isOpen={isOpenReject} onClose={() => setIsOpenReject(false)} title="Odbij zahtev" size="xl" loading={loading} onConfirm={handleReject}>
        <div className="flex flex-col">
          <label>Razlog za odbijanje</label>
          <textarea className="form-input h-30" value={updateData.rejectionReason} onChange={e => setUpdateData({ ...updateData, rejectionReason: e.target.value })} placeholder="Unesite razlog za odbijanje"></textarea>
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
    </div>
  );
}
