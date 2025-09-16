import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import type { Building } from "../types/building";
import { getBuildings } from "../services/buildingService";
import axios from "axios";
import { PopupType, useToast } from "../hooks/useToast";
import FullScreenLoader from "../components/FullScreenLoader";
import { Building as BuildingIcon } from "lucide-react";
import { useNavigate } from "react-router";

export default function BuildingsPage() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const navigate = useNavigate();

  const { showToast } = useToast();

  useEffect(() => {
    const fetchBuildings = async () => {
      if (user.constructionCompanyId) {
        try {
          setLoading(true);
          const data = await getBuildings(user.constructionCompanyId);
          setBuildings(data);
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
      }
    };

    fetchBuildings();
  }, []);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="planel flex-col shadow-md flex items-center justify-center bg-white rounded-md p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        <div className="col-span-1 col-start-3 flex justify-end items-center">
          <button className="btn btn-outline-primary text-xl" onClick={() => navigate("/buildings/create")}>+ Dodaj zgradu</button>
        </div>
        {
          buildings.map((item, index) => (
            <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-3 gap-2">
              <div className="col-span-1 flex flex-start items-center"><BuildingIcon size={140} strokeWidth={1} color="#c7671e" /></div>
              <div className="col-span-2 flex flex-col">
                <div className="mb-2">
                  <span className={`${item.isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>{item.isCompleted ? "Završena" : "U izgradnji"}</span>
                </div>
                <div className="text-gray-500 flex flex-col mb-2">
                  <span>Broj parcele:</span>
                  {item.parcelNumber}
                </div>
                <div className="text-gray-500 flex flex-col mb-2">
                  <span>Adresa:</span>
                  <span>
                    {item.city}
                    ,
                    {" "}
                    {item.address}
                  </span>
                </div>
              </div>
              <div className="col-span-3">
                <button className="btn btn-primary w-full" onClick={() => navigate(`/buildings/${item.id}`)}>Detalji</button>
              </div>
            </div>
          ),
          )
        }
      </div>
    </div>
  );
}
