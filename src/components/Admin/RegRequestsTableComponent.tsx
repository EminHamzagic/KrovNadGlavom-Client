import { useEffect, useState } from "react";
import type { PaginationParams, QueryParameters } from "../../types/apartment";
import FullScreenLoader from "../FullScreenLoader";
import Pagination from "../Pagination";
import type { UpdateRegStatus, User } from "../../types/user";
import { handleError } from "../../utils/handleError";
import { getUsersPage, updateUserRegStatus } from "../../services/userService";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, ExternalLink, Search, X } from "lucide-react";
import Modal from "../Modal";
import { PopupType, useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router";

export default function RegRequestsTableComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<QueryParameters>({
    pageNumber: 1,
    pageSize: 10,
    sortType: "asc",
    sortProperty: "",
    searchText: "",
    isAllowed: false,
  });
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [text, setText] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenReject, setIsOpenReject] = useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<UpdateRegStatus>({
    allowed: false,
    reason: "",
  });

  const { showToast } = useToast();
  const navigate = useNavigate();

  const setPaginationParams = (params: PaginationParams) => {
    setTotalPages(params.TotalPages);
    setTotalCount(params.TotalCount);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const { data, pagination } = await getUsersPage(queryParams);
        setUsers(data);
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

  const handleAccept = async () => {
    if (selectedId) {
      try {
        setLoadingModal(true);
        await updateUserRegStatus(selectedId, { allowed: true });
        setReload(prev => !prev);
        setSelectedId(null);
        setIsOpen(false);
        showToast(PopupType.Success, "Zahtev za registraciju je uspešno prihvaćen");
      }
      catch (err) {
        handleError(err);
      }
      finally {
        setLoadingModal(false);
      }
    }
  };

  const handleReject = async () => {
    if (selectedId) {
      try {
        setLoadingModal(true);
        await updateUserRegStatus(selectedId, updateStatus);
        setReload(prev => !prev);
        setSelectedId(null);
        setIsOpenReject(false);
        showToast(PopupType.Success, "Zahtev za registraciju je uspešno odbijen");
      }
      catch (err) {
        handleError(err);
      }
      finally {
        setLoadingModal(false);
      }
    }
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div>
      <h1 className="text-3xl">Zahtevi</h1>

      <div className="mt-5 w-full sm:w-1/4 relative">
        <input
          type="text"
          className="form-input"
          placeholder="Pretraži korisnike..."
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
                onClick={() => handleSort("name")}
              >
                Ime
                {" "}
                {renderSortIcon("name")}
              </th>
              <th
                className="p-2 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("lastname")}
              >
                Prezime
                {" "}
                {renderSortIcon("lastname")}
              </th>
              <th
                className="p-2 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("username")}
              >
                Korisničko ime
                {" "}
                {renderSortIcon("username")}
              </th>
              <th
                className="p-2 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("email")}
              >
                Email
                {" "}
                {renderSortIcon("email")}
              </th>
              <th
                className="p-2 cursor-pointer select-none whitespace-nowrap"
              >
                Tip
              </th>
              <th
                className="p-2 cursor-pointer select-none whitespace-nowrap"
              >
                Akcije
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0
              ? (
                  users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-2">{user.name}</td>
                      <td className="p-2">{user.lastname}</td>
                      <td className="p-2">{user.username}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.agencyId ? "Agencija" : "Kompanija"}</td>
                      <td className="p-2 flex gap-2">
                        <ExternalLink
                          className="text-primary cursor-pointer"
                          size={20}
                          onClick={() => {
                            if (user.agencyId)
                              navigate(`/agency/${user.agencyId}`);
                            else if (user.constructionCompanyId)
                              navigate(`/company/${user.constructionCompanyId}`);
                          }}
                        />
                        <Check
                          className="text-success cursor-pointer"
                          size={20}
                          onClick={() => {
                            setIsOpen(true);
                            setSelectedId(user.id);
                          }}
                        />
                        <X
                          color="red"
                          size={20}
                          className="cursor-pointer"
                          onClick={() => {
                            setUpdateStatus({ ...updateStatus, reason: "" });
                            setIsOpenReject(true);
                            setSelectedId(user.id);
                          }}
                        />
                      </td>
                    </tr>
                  ))
                )
              : (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      Nema zahteva
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Prihvatanje zahteva" loading={loadingModal} onConfirm={handleAccept}>
        <div>
          <p>Da li ste sigurni da želite da prihvatite zahtev za registraciju?</p>
        </div>
      </Modal>

      <Modal isOpen={isOpenReject} onClose={() => setIsOpenReject(false)} title="Odbijanje zahteva" loading={loadingModal} onConfirm={handleReject} size="xl">
        <div>
          <label>Razlog odbijanja:</label>
          <textarea className="form-input h-40" placeholder="Unesite razlog odbijanja" value={updateStatus.reason} onChange={e => setUpdateStatus({ ...updateStatus, reason: e.target.value })}></textarea>
        </div>
      </Modal>
    </div>
  );
}
