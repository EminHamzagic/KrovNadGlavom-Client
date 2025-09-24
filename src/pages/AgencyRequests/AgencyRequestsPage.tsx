import { useContext, useEffect, useState } from "react";
import { StatusEnum } from "../../types/agencyRequest";
import type { AgencyRequest } from "../../types/agencyRequest";
import { getAgencyBuildingRequests, getCompanyBuildingRequests } from "../../services/agencyRequestService";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { PopupType, useToast } from "../../hooks/useToast";
import RequestCard from "./RequestCard";
import FullScreenLoader from "../../components/FullScreenLoader";

export default function AgencyRequestsPage() {
  const [requests, setRequests] = useState<AgencyRequest[]>([]);
  const [status, setStatus] = useState<StatusEnum>(StatusEnum.Pending);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  const { user } = useContext(UserContext);
  const { showToast } = useToast();

  const statusLabels: Record<StatusEnum, string> = {
    [StatusEnum.Pending]: "Na čekanju",
    [StatusEnum.Approved]: "Odobreno",
    [StatusEnum.Rejected]: "Odbijeno",
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);

      try {
        if (user.agencyId) {
          const data = await getAgencyBuildingRequests(user.agencyId, status);
          setRequests(data);
        }
        if (user.constructionCompanyId) {
          const data = await getCompanyBuildingRequests(user.constructionCompanyId, status);
          setRequests(data);
        }
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

    fetchRequests();
  }, [status, reload]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="planel flex-col shadow-md flex bg-white rounded-md p-4">
      <h1 className="text-3xl">Zahtevi</h1>
      <ul className="flex flex-wrap -mb-px">
        {Object.values(StatusEnum).map(s => (
          <li key={s} className="me-2">
            <button
              onClick={() => setStatus(s)}
              className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                status === s
                  ? "text-primary border-primary"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              {statusLabels[s]}
            </button>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
        {requests.length
          ? requests.map((item, index) => (
              <RequestCard key={index} request={item} setReload={setReload} />
            ))
          : <h1 className="text-xl">Nema zahteva</h1>}
      </div>
    </div>
  );
}
