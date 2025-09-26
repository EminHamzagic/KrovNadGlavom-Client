import { useContext, useEffect, useState } from "react";
import { Building as BuildingIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { UserContext } from "../../context/UserContext";
import type { Building } from "../../types/building";
import { getBuildings, getCompanyBuildings } from "../../services/buildingService";
import FullScreenLoader from "../../components/FullScreenLoader";
import { RequireRole } from "../../components/Auth/RequireRole";
import { handleError } from "../../utils/handleError";
import type { PaginationParams, QueryParameters } from "../../types/apartment";
import Pagination from "../../components/Pagination";

export default function BuildingsPage() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
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
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        if (user.constructionCompanyId) {
          const { data, pagination } = await getCompanyBuildings(user.constructionCompanyId, queryParams);
          setBuildings(data);
          setPaginationParams(pagination);
        }
        else if (user.agencyId) {
          const { data, pagination } = await getBuildings(user.agencyId, queryParams);
          setBuildings(data);
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

    fetchBuildings();
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
            placeholder="Pretraži kompanije..."
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
      <div className="planel flex-col shadow-md flex items-center justify-center bg-white rounded-md p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          <RequireRole roles={["Company"]}>
            <div className="col-span-1 sm:col-start-3 flex justify-end items-center">
              <button className="btn btn-outline-primary text-xl" onClick={() => navigate("/buildings/create")}>+ Dodaj zgradu</button>
            </div>
          </RequireRole>
          {
            buildings.length
              ? buildings.map((item, index) => (
                  <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-3 gap-2">
                    <div className="col-span-1 flex flex-start items-center"><BuildingIcon size={140} strokeWidth={1} color="#c7671e" /></div>
                    <div className="col-span-2 flex flex-col">
                      <div className="mb-2">
                        <span className={`${item.isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>{item.isCompleted ? "Završena" : "U izgradnji"}</span>
                      </div>
                      <div className="text-gray-500 flex flex-col mb-2">
                        <span>Broj parcele:</span>
                        {item.parcelNumber}
                      </div>
                      {item.company && (
                        <div className="text-gray-500 flex flex-col mb-2">
                          <span>Kompanija:</span>
                          {item.company.name}
                        </div>
                      )}
                      <div className="text-gray-500 flex flex-col mb-2">
                        <span>Adresa:</span>
                        <span>
                          {item.city}
                          ,
                          {" "}
                          {item.address}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <button className="btn btn-primary w-full" onClick={() => navigate(`/buildings/${item.id}`)}>Detalji</button>
                    </div>
                  </div>
                ),
                )
              : <span className="text-2xl">Nema zgrada</span>
          }
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
