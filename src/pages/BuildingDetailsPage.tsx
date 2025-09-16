import { useParams } from "react-router";

export default function BuildingDetailsPage() {
  const { buildingId } = useParams<{ buildingId: string }>();

  return (
    <div className="planel shadow-md flex items-center justify-center bg-white rounded-md p-4">
      <h1>Detalji zgrade</h1>
      <p>
        ID:
        {buildingId}
      </p>
    </div>
  );
}
