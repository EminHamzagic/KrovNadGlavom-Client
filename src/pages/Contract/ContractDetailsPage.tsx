import { Link, useParams } from "react-router";
import type { Contract } from "../../types/contract";
import { useEffect, useState } from "react";
import { handleError } from "../../utils/handleError";
import { getContractById } from "../../services/contractService";
import FullScreenLoader from "../../components/FullScreenLoader";
import InstallmentList from "../../components/Installment/InstallmentList";
import { ExternalLink } from "lucide-react";

export default function ContractDetailsPage() {
  const { contractId } = useParams<{ contractId: string }>();

  const [contract, setContract] = useState<Contract>({} as Contract);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    const fetchContracts = async () => {
      if (contractId) {
        setLoading(true);
        try {
          const data = await getContractById(contractId);
          setContract(data);
        }
        catch (err) {
          handleError(err);
        }
        finally {
          setLoading(false);
        }
      }
    };

    fetchContracts();
  }, [reload]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <div className="planel shadow-md flex-col flex justify-center bg-white rounded-md p-4 mb-10">
        <div className="flex justify-between items-center flex-col sm:flex-row mb-10">
          <h1 className="text-3xl">Detalji ugovora</h1>
          <a href="https://res.cloudinary.com/dp6gqdlbn/image/upload/v1758890009/Uslovi_kori%C5%A1%C4%87enja_ekeurh.pdf" target="_" className="text-primary underline hover:text-primary-dark-light transition duration-300 flex gap-2 items-center">
            Uslovi korišćenja
            <ExternalLink size={18} />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 w-full">
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Broj ugovora:</span>
            <span>{contract.id.slice(0, 6)}</span>
          </div>
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Kupac:</span>
            <span>{`${contract.user.name} ${contract.user.lastname}`}</span>
          </div>
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Agencija:</span>
            <Link to={`/agency/${contract.agencyId}`} className="text-primary hover:underline">{contract.agency.name}</Link>
          </div>

          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Stan:</span>
            <Link to={`/apartments/${contract.apartmentId}`} className="text-primary hover:underline">{contract.apartment.apartmentNumber}</Link>
          </div>
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Adresa stana:</span>
            <span>
              {contract.apartment.building.address}
              ,
              {" "}
              {contract.apartment.building.city}
            </span>
          </div>
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Status ugovora:</span>
            <span className={`${contract.status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text-xs w-fit font-medium me-2 px-2.5 py-0.5 rounded-sm`}>{contract.status === "Paid" ? "Isplaćeno" : "Nije isplaćeno"}</span>
          </div>

          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Cena stana:</span>
            <span>
              {contract.price}
              €
            </span>
          </div>
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Broj rata:</span>
            <span>{contract.installmentCount}</span>
          </div>
          <div className="col-span-1 flex flex-col mb-3">
            <span className="font-bold">Iznos rate:</span>
            <span>
              {contract.installmentAmount}
              €
              {contract.price - contract.installmentAmount * (contract.installmentCount - 1) !== contract.installmentAmount && (
                <span className="ml-2">
                  (poslednja rata:
                  {" "}
                  <span className="font-bold">
                    {contract.price - contract.installmentAmount * (contract.installmentCount - 1)}
                    €
                  </span>
                  )
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <InstallmentList installments={contract.installments} setReload={setReload} />
    </>
  );
}
