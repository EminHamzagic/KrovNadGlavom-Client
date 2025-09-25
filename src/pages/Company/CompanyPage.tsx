import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Company } from "../../types/company";
import { getCompany, updateCompany } from "../../services/companyService";
import { handleError } from "../../utils/handleError";
import FullScreenLoader from "../../components/FullScreenLoader";
import { PenLine } from "lucide-react";
import Modal from "../../components/Modal";
import { PopupType, useToast } from "../../hooks/useToast";

interface CompanyToUpdate {
  name: string;
  pIB: string;
  address: string;
  email: string;
  phone: string;
  city: string;
  description: string;
}

export default function CompanyPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<Company>({} as Company);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<CompanyToUpdate>({} as CompanyToUpdate);
  const [reload, setReload] = useState<boolean>(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchCompany = async () => {
      if (companyId) {
        try {
          setLoading(true);
          const data = await getCompany(companyId);
          // console.log("Company data received:", data);
          setCompany(data);
          // Initialize edit form with current data (excluding bankAccountNumber as per backend DTO)
          setEditForm({
            name: data.name,
            pIB: data.pIB,
            address: data.address,
            email: data.email,
            phone: data.phone,
            city: data.city,
            description: data.description,
          });
          // console.log("Company edit form initialized:", {
          //   name: data.name,
          //   pIB: data.pIB,
          //   address: data.address,
          //   email: data.email,
          //   phone: data.phone,
          //   city: data.city,
          //   description: data.description,
          // });
        }
        catch (err) {
          handleError(err);
        }
        finally {
          setLoading(false);
        }
      }
    };

    fetchCompany();
  }, [reload]);

  const handleEdit = async () => {
    if (companyId) {
      try {
        setLoadingModal(true);
        await updateCompany(companyId, editForm);
        showToast(PopupType.Success, "Kompanija je uspešno ažurirana");
        setIsEditOpen(false);
        setReload(!reload);
      }
      catch (err) {
        handleError(err);
      }
      finally {
        setLoadingModal(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <div className="planel shadow-md flex-col flex justify-center bg-white rounded-md p-4 mb-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl">Profil kompanije</h1>
          <div className="flex gap-2">
            <button
              className="btn btn-primary px-3"
              onClick={() => setIsEditOpen(true)}
            >
              <PenLine size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {company.logoUrl && (
            <div className="flex flex-col mb-3 col-span-full md:col-span-1">
              <span className="font-bold mb-2">Logo:</span>
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                className="w-32 h-32 object-contain rounded-md border"
              />
            </div>
          )}

          <div className="flex flex-col mb-3">
            <span className="font-bold">Naziv kompanije:</span>
            <span>{company.name}</span>
          </div>

          <div className="flex flex-col mb-3">
            <span className="font-bold">PIB:</span>
            <span>{company.pIB || "N/A"}</span>
          </div>

          <div className="flex flex-col mb-3">
            <span className="font-bold">Email:</span>
            <span>{company.email}</span>
          </div>

          <div className="flex flex-col mb-3">
            <span className="font-bold">Telefon:</span>
            <span>{company.phone}</span>
          </div>

          <div className="flex flex-col mb-3">
            <span className="font-bold">Grad:</span>
            <span>{company.city}</span>
          </div>

          <div className="flex flex-col mb-3">
            <span className="font-bold">Adresa:</span>
            <span>{company.address}</span>
          </div>

          <div className="flex flex-col mb-3">
            <span className="font-bold">Broj žiro računa:</span>
            <span>{company.bankAccountNumber || "N/A"}</span>
          </div>

          <div className="col-span-full flex flex-col mb-3">
            <span className="font-bold">Opis:</span>
            <span>{company.description || "/"}</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Uredi kompaniju"
        onConfirm={handleEdit}
        loading={loadingModal}
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-bold mb-2">Naziv kompanije:</label>
            <input
              type="text"
              name="name"
              value={editForm.name || ""}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-2">PIB:</label>
            <input
              type="text"
              name="pIB"
              value={editForm.pIB || ""}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={editForm.email || ""}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-2">Telefon:</label>
            <input
              type="text"
              name="phone"
              value={editForm.phone || ""}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-2">Grad:</label>
            <input
              type="text"
              name="city"
              value={editForm.city || ""}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-2">Adresa:</label>
            <input
              type="text"
              name="address"
              value={editForm.address || ""}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col col-span-full">
            <label className="font-bold mb-2">Opis:</label>
            <textarea
              name="description"
              value={editForm.description || ""}
              onChange={handleInputChange}
              rows={4}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
