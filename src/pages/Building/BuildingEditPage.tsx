import { useParams } from "react-router";
import CreateBuildingPage from "./CreateBuildingPage";
import { useEffect, useState } from "react";
import type { Building } from "../../types/building";
import { getBuildingById } from "../../services/buildingService";
import FullScreenLoader from "../../components/FullScreenLoader";
import { handleError } from "../../utils/handleError";

export default function BuildingEditPage() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const [building, setBuilding] = useState<Building>({} as Building);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBuilding = async () => {
      if (buildingId) {
        try {
          setLoading(true);
          const data = await getBuildingById(buildingId);
          setBuilding(data);
        }
        catch (err) {
          handleError(err);
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
