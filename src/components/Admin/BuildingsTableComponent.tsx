import { useEffect, useState } from "react";
import type { PaginationParams, QueryParameters } from "../../types/apartment";
import FullScreenLoader from "../FullScreenLoader";
import Pagination from "../Pagination";
import { handleError } from "../../utils/handleError";
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink, Search, Trash } from "lucide-react";
import type { Building } from "../../types/building";
import { deleteBuilding, getBuildingsPage } from "../../services/buildingService";
import { formatDate } from "../../utils/dateFormatter";
import { useNavigate } from "react-router";
import Modal from "../Modal";
import { PopupType, useToast } from "../../hooks/useToast";

export default function BuildingsTableComponent() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<QueryParameters>({
    pageNumber: 1,
    pageSize: 10,
    sortType: "asc",
    sortProperty: "",
    searchText: "",
  });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [text, setText] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const setPaginationParams = (params: PaginationParams) => {
    setTotalPages(params.TotalPages);
    setTotalCount(params.TotalCount);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const { data, pagination } = await getBuildingsPage(queryParams);
        setBuildings(data);
        setPaginationParams(pagination);
      }
      catch (err) {
        handleError(err);
      }
      finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [queryParams, reload]);

  const handleFiltersApply = (params: QueryParameters) => {
    const currentPage = queryParams.pageNumber;
    const currentPageSize = queryParams.pageSize;
    setQueryParams({
      ...params,
      pageNumber: currentPage,
      pageSize: currentPageSize,
    });
  };

  const handleSort = (property: string) => {
    let newSortType: "asc" | "desc" = "asc";

    if (queryParams.sortProperty === property && queryParams.sortType === "asc") {
      newSortType = "desc";
    }

    handleFiltersApply({
      ...queryParams,
      sortProperty: property,
      sortType: newSortType,
    });
  };

  const renderSortIcon = (property: string) => {
    if (queryParams.sortProperty !== property)
      return <ArrowUpDown size={16} className="inline ml-1 text-gray-400" />;
    return queryParams.sortType === "asc"
      ? (
          <ArrowUp size={16} className="inline ml-1 text-primary" />
        )
      : (
          <ArrowDown size={16} className="inline ml-1 text-primary" />
        );
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        setLoadingDelete(true);
        await deleteBuilding(deleteId);
        setReload(prev => !prev);
        setDeleteId(null);
        setIsOpen(false);
        showToast(PopupType.Success, "Zgrada je uspešno izbrisan");
      }
      catch (err) {
        handleError(err);
      }
      finally {
        setLoadingDelete(false);
      }
    }
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div>
      <h1 className="text-3xl">Zgrade</h1>

      <div className="mt-5 w-full sm:w-1/4 relative">
        <input
          type="text"
          className="form-input"
          placeholder="Pretraži zgrade..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              handleFiltersApply({ ...queryParams, searchText: text });
          }}
        />
        <Search className="absolute right-2 top-1.5" color="#dedcdc" />
      </div>
      <div className="overflow-x-auto mt-5  border-b border-gray-300">
        <table className="min-w-full border border-gray-300 rounded-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th
                className="p-2 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("parcelNumber")}
              >
                Broj parcele
                {" "}
                {renderSortIcon("parcelNumber")}
              </th>
              <th
                className="p-2 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("area")}
              >
                Površina
                {" "}
                {renderSortIcon("area")}
              </th>
              <th
                className="p-2 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("startDate")}
              >
                Početak izgradnje
                {" "}
                {renderSortIcon("startDate")}
              </th>
              <th
                className="p-2 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("city")}
              >
                Grad
                {" "}
                {renderSortIcon("city")}
              </th>
              <th
                className="p-2 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("address")}
              >
                Adresa
                {" "}
                {renderSortIcon("address")}
              </th>
              <th
                className="p-2 cursor-pointer select-none whitespace-nowrap"
              >
                Akcije
              </th>
            </tr>
          </thead>
          <tbody>
            {buildings.length > 0
              ? (
                  buildings.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-2">{item.parcelNumber}</td>
                      <td className="p-2">{item.area}</td>
                      <td className="p-2">{formatDate(item.startDate)}</td>
                      <td className="p-2">{item.city}</td>
                      <td className="p-2">{item.address}</td>
                      <td className="p-2 flex gap-2">
                        <ExternalLink className="text-primary cursor-pointer" size={20} onClick={() => navigate(`/buildings/${item.id}`)} />
                        <Trash
                          className="cursor-pointer"
                          color="red"
                          size={20}
                          onClick={() => {
                            setIsOpen(true);
                            setDeleteId(item.id);
                          }}
                        />
                      </td>
                    </tr>
                  ))
                )
              : (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      Nema zgrada
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Brisanje zgrade" loading={loadingDelete} onConfirm={handleDelete}>
        <div>
          <p>Da li ste sigurni da želite da izbrišete ovu zgradu?</p>
        </div>
      </Modal>
    </div>
  );
}
