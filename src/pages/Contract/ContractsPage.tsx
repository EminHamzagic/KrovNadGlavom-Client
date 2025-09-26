import { useContext, useEffect, useState } from "react";
import { PaymentStatusEnum } from "../../types/contract";
import type { Contract } from "../../types/contract";
import { UserContext } from "../../context/UserContext";
import { getAgencyContracts, getUserContracts } from "../../services/contractService";
import { handleError } from "../../utils/handleError";
import FullScreenLoader from "../../components/FullScreenLoader";
import ContractCard from "./ContractCard";
import type { PaginationParams, QueryParameters } from "../../types/apartment";
import Pagination from "../../components/Pagination";

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<QueryParameters>({
    pageNumber: 1,
    pageSize: 15,
    status: PaymentStatusEnum.Unpaid,
    sortType: "asc",
    searchText: "",
  });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);

  const { user } = useContext(UserContext);

  const statusLabels: Record<PaymentStatusEnum, string> = {
    [PaymentStatusEnum.Unpaid]: "Neplaćeno",
    [PaymentStatusEnum.Paid]: "Plaćeno",
  };

  const setPaginationParams = (params: PaginationParams) => {
    setTotalPages(params.TotalPages);
    setTotalCount(params.TotalCount);
  };

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);

      try {
        if (user.agencyId) {
          const { data, pagination } = await getAgencyContracts(user.agencyId, queryParams);
          setContracts(data);
          setPaginationParams(pagination);
        }
        else {
          const { data, pagination } = await getUserContracts(user.id, queryParams);
          setContracts(data);
          setPaginationParams(pagination);
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
  }, [queryParams]);

  const handleFiltersApply = (params: QueryParameters) => {
    const currentPage = queryParams.pageNumber;
    const currentPageSize = queryParams.pageSize;
    setQueryParams({
      ...params,
      pageNumber: currentPage,
      pageSize: currentPageSize,
    });
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="planel flex-col shadow-md flex bg-white rounded-md p-4">
      <h1 className="text-3xl">Ugovori</h1>
      <ul className="flex flex-wrap -mb-px">
        {Object.values(PaymentStatusEnum).map(s => (
          <li key={s} className="me-2">
            <button
              onClick={() => handleFiltersApply({ ...queryParams, status: s })}
              className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                queryParams.status === s
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
        {contracts.length
          ? contracts.map((item, index) => (
              <ContractCard key={index} contract={item} />
            ))
          : <h1 className="text-xl">Nema ugovora</h1>}
      </div>

      <Pagination
        currentPage={queryParams.pageNumber}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={queryParams.pageSize}
        onPageChange={(page) => {
          setQueryParams(prev => ({ ...prev, pageNumber: page }));
        }}
      />
    </div>
  );
}
