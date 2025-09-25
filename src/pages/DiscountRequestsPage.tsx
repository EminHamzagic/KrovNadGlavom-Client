import { useContext, useEffect, useState } from "react";
import FullScreenLoader from "../components/FullScreenLoader";
import { StatusEnum } from "../types/agencyRequest";
import { handleError } from "../utils/handleError";
import type { DiscountRequest } from "../types/discountRequest";
import { UserContext } from "../context/UserContext";
import { getAgencyDiscountRequests, getCompanyDiscountRequests, getUserDiscountRequests } from "../services/discountRequestService";
import DiscountRequestCard from "../components/DiscountRequest/DiscountRequestCard";

export default function DiscountRequestsPage() {
  const [requests, setRequests] = useState<DiscountRequest[]>([]);
  const [status, setStatus] = useState<StatusEnum>(StatusEnum.Pending);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  const { user } = useContext(UserContext);

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
          const data = await getAgencyDiscountRequests(user.agencyId, status);
          setRequests(data);
        }
        else if (user.constructionCompanyId) {
          const data = await getCompanyDiscountRequests(user.constructionCompanyId, status);
          setRequests(data);
        }
        else {
          const data = await getUserDiscountRequests(user.id, status);
          setRequests(data);
        }
      }
      catch (err) {
        handleError(err);
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
      <h1 className="text-3xl">Zahtevi za popust</h1>
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
              <DiscountRequestCard key={index} request={item} setReload={setReload} />
            ))
          : <h1 className="text-xl">Nema zahteva</h1>}
      </div>
    </div>
  );
}
