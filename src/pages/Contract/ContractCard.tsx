import { useContext } from "react";
import type { Contract } from "../../types/contract";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router";

interface Props {
  contract: Contract;
}

export default function ContractCard({ contract }: Props) {
  const { getUserType } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-3 gap-2 relative">
      <div className="col-span-3 flex flex-col">
        <span className={`${contract.status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text-xs w-fit font-medium me-2 px-2.5 py-0.5 rounded-sm`}>{contract.status === "Paid" ? "Isplaćeno" : "Nije isplaćeno"}</span>

        <div className="text-gray-500 flex gap-2 mt-2">
          <span>Broj ugovora:</span>
          <span>
            {contract.id.slice(0, 6)}
          </span>
        </div>
        <div className="text-gray-500 flex gap-2 mt-2">
          <span>Broj stana:</span>
          <span>
            {contract.apartment.apartmentNumber}
          </span>
        </div>
        {getUserType() === "User" && (
          <div className="text-gray-500 flex gap-2 mt-2">
            <span>Agencija:</span>
            <span>
              {contract.agency.name}
            </span>
          </div>
        )}
        {getUserType() === "Agency" && (
          <div className="text-gray-500 flex gap-2 mt-2">
            <span>Kupac:</span>
            <span>
              {`${contract.user.name} ${contract.user.lastname}`}
            </span>
          </div>
        )}
        <button className="w-full btn btn-primary mt-5" onClick={() => navigate(contract.id)}>Detalji</button>
      </div>
    </div>
  );
}
