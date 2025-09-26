import { useEffect, useState } from "react";
import type { Agency } from "../../types/agency";
import { getAllAgencies } from "../../services/agencyService";
import { handleError } from "../../utils/handleError";
import { useNavigate } from "react-router";
import type { PaginationParams, QueryParameters } from "../../types/apartment";
import FullScreenLoader from "../../components/FullScreenLoader";
import Pagination from "../../components/Pagination";

export default function AllAgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [queryParams, setQueryParams] = useState<QueryParameters>({
    pageNumber: 1,
    pageSize: 15,
    searchText: "",
    sortType: "asc",
  });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [text, setText] = useState<string>("");

  const navigate = useNavigate();

  const setPaginationParams = (params: PaginationParams) => {
    setTotalPages(params.TotalPages);
    setTotalCount(params.TotalCount);
  };

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoading(true);
        const { data, pagination } = await getAllAgencies(queryParams);
        setAgencies(data);
        setPaginationParams(pagination);
      }
      catch (err) {
        handleError(err);
      }
      finally {
        setLoading(false);
      }
    };

    fetchAgencies();
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
    <>
      <div className="planel flex-col shadow-md flex bg-white rounded-md p-4 mb-4">
        <div className="flex">
          <input
            type="text"
            className="form-input rounded-r-none"
            placeholder="Pretraži agencije..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFiltersApply({ ...queryParams, searchText: text });
              }
            }}
          />
          <button
            className="btn btn-primary rounded-l-none"
            onClick={() => {
              handleFiltersApply({ ...queryParams, searchText: text });
            }}
          >
            Pretraži
          </button>
        </div>
      </div>

      <div className="planel flex-col shadow-md flex bg-white rounded-md p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">

          {agencies.length
            ? agencies.map((item, index) => (
                <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-3 gap-2">
                  <div className="col-span-1 flex justify-center items-center">
                    <img src={item.logoUrl ?? ""} className="h-20 w-20 object-cover rounded-full" />
                  </div>
                  <div className="col-span-2 flex flex-col">
                    <div className="text-gray-500 flex gap-2 mb-2">
                      <span className="text-2xl text-black">{item.name}</span>
                    </div>
                    <div className="text-gray-500 flex gap-2 mb-2">
                      <span>
                        Broj stanova:
                        {item.numberOfApartments}
                      </span>
                    </div>
                    <div className="text-gray-500 flex gap-2 mb-2">
                      <span>
                        Broj zgrada:
                        {item.numberOfBuildings}
                      </span>
                    </div>

                  </div>
                  <button className="btn btn-primary w-full mt-4 col-span-full" onClick={() => navigate(item.id)}>Detalji</button>
                </div>
              ))
            : <span className="text-2xl">Nema agencija</span>}
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
