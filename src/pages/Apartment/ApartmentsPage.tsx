import { useEffect, useState } from "react";
import type { Apartment, PaginationParams, QueryParameters } from "../../types/apartment";
import { getAvailableApartments } from "../../services/apartmentService";
import FullScreenLoader from "../../components/FullScreenLoader";
import { Bed } from "lucide-react";
import Pagination from "../../components/Pagination";
import FilterOptions from "../../components/FIlterOptions";
import { useNavigate } from "react-router";
import { handleError } from "../../utils/handleError";

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParameters>({
    pageNumber: 1,
    pageSize: 15,
    searchText: "",
    sortProperty: "",
    sortType: "asc",
    city: "",
    address: "",
    area: 0,
    roomCount: 0,
    balconyCount: 0,
    floor: 0,
    orientation: "",
    withGarage: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);

  const navigate = useNavigate();

  const setPaginationParams = (params: PaginationParams) => {
    setTotalPages(params.TotalPages);
    setTotalCount(params.TotalCount);
  };

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const { data, pagination } = await getAvailableApartments(queryParams);

        setApartments(data);
        setPaginationParams(pagination);
      }
      catch (err) {
        handleError(err);
      }
      finally {
        setLoading(false);
      }
    };

    fetchApartments();
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

  const handleFiltersCancel = () => {
    setQueryParams({
      pageNumber: 1,
      pageSize: 15,
      searchText: "",
      sortProperty: "",
      sortType: "asc",
      city: "",
      address: "",
      area: 0,
      roomCount: 0,
      balconyCount: 0,
      floor: 0,
      orientation: "",
      withGarage: null,
    });
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <FilterOptions initialParams={queryParams} onApply={handleFiltersApply} onCancel={handleFiltersCancel} />
      <div className="planel flex-col shadow-md flex items-center justify-center bg-white rounded-md p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
          {apartments.length
            ? apartments.map((item, index) => (
                <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-3 gap-2">
                  <div className="col-span-1 flex flex-start items-center"><Bed size={120} strokeWidth={1} color="#c7671e" /></div>
                  <div className="col-span-2 flex flex-col">
                    <div className="mb-2">
                      <span className={`${item.building.isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>{item.building.isCompleted ? "Zgrada završena" : "Zgrada u izgradnji"}</span>
                    </div>
                    <div className="text-gray-500 flex gap-2 mb-2">
                      <span>Površina:</span>
                      {item.area}
                      m²
                    </div>
                    <div className="text-gray-500 flex gap-2 mb-2">
                      <span>Sprat:</span>
                      {item.floor}
                      .
                    </div>
                    <div className="text-gray-500 flex gap-2 mb-2">
                      <span>Broj soba:</span>
                      {item.roomCount}
                    </div>
                    <div className="text-gray-500 flex gap-2 mb-2">
                      <span>Adresa:</span>
                      {item.building.address}
                    </div>
                  </div>
                  <button className="btn btn-primary col-span-3" onClick={() => navigate(`/apartments/${item.id}`)}>Detalji</button>
                </div>
              ))
            : <h1>Nema stanova</h1>}
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
    </>
  );
}
