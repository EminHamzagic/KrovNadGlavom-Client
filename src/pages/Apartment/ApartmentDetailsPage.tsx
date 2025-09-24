import { useParams } from "react-router";

export default function ApartmentDetailsPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>();

  return <div className="planel shadow-md flex-col flex justify-center bg-white rounded-md p-4 mb-10">{apartmentId}</div>;
}
