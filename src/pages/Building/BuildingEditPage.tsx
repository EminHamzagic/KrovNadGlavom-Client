import { useParams } from "react-router";
import CreateBuildingPage from "./CreateBuildingPage";
import { useEffect, useState } from "react";
import type { Building } from "../../types/building";
import { getBuildingById } from "../../services/buildingService";
import axios from "axios";
import { PopupType, useToast } from "../../hooks/useToast";
import FullScreenLoader from "../../components/FullScreenLoader";

export default function BuildingEditPage() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const [building, setBuilding] = useState<Building>({} as Building);
  const [loading, setLoading] = useState<boolean>(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchBuilding = async () => {
      if (buildingId) {
        try {
          setLoading(true);
          const data = await getBuildingById(buildingId);
          setBuilding(data);
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

    fetchBuilding();
  }, []);

  if (loading) {
    return <FullScreenLoader />;
  }

  return <CreateBuildingPage building={building} />;
}
