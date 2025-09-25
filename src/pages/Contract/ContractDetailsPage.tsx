import { useParams } from "react-router";

export default function ContractDetailsPage() {
  const { contractId } = useParams<{ contractId: string }>();

  return <div className="planel flex-col shadow-md flex items-center justify-center bg-white rounded-md p-4">{contractId}</div>;
}
