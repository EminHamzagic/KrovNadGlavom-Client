import { useContext, useEffect, useState } from "react";
import type { Contract } from "../../types/contract";
import { UserContext } from "../../context/UserContext";
import { getAgencyContracts, getUserContracts } from "../../services/contractService";
import { handleError } from "../../utils/handleError";
import FullScreenLoader from "../../components/FullScreenLoader";
import ContractCard from "./ContractCard";

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);

      try {
        if (user.agencyId) {
          const data = await getAgencyContracts(user.agencyId);
          setContracts(data);
        }
        else {
          const data = await getUserContracts(user.id);
          setContracts(data);
        }
      }
      catch (err) {
        handleError(err);
      }
      finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="planel flex-col shadow-md flex bg-white rounded-md p-4">
      <h1 className="text-3xl">Ugovori</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
        {contracts.length
          ? contracts.map((item, index) => (
              <ContractCard key={index} contract={item} />
            ))
          : <h1 className="text-xl">Nema ugovora</h1>}
      </div>
    </div>
  );
}
