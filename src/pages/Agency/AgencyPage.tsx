import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import type { Agency, AgencyToAdd } from "../../types/agency";
import { getAgency, updateAgency, uploadAgencyLogo } from "../../services/agencyService";
import { handleError } from "../../utils/handleError";
import FullScreenLoader from "../../components/FullScreenLoader";
import { PenLine } from "lucide-react";
import Modal from "../../components/Modal";
import { PopupType, useToast } from "../../hooks/useToast";
import type { LogoUpload } from "../../types/company";

export default function AgencyPage() {
  const { agencyId } = useParams<{ agencyId: string }>();
  const [agency, setAgency] = useState<Agency>({} as Agency);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<AgencyToAdd>({} as AgencyToAdd);
  const [reload, setReload] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoData, setLogoData] = useState<LogoUpload | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchAgency = async () => {
      if (agencyId) {
        try {
          setLoading(true);
          const data = await getAgency(agencyId);
          setAgency(data);
          setLogoPreview(data.logoUrl);
          // Initialize edit form with current data
          setEditForm({
            name: data.name,
            pib: data.pib,
            address: data.address,
            email: data.email,
            phone: data.phone,
            city: data.city,
            description: data.description,
            bankAccountNumber: data.bankAccountNumber,
          });
        }
        catch (err) {
          handleError(err);
        }
        finally {
          setLoading(false);
        }
      }
    };

    fetchAgency();
  }, [reload]);

  const handleFileUpload = async (agencyId: string) => {
    if (logoData) {
      try {
        await uploadAgencyLogo({ ...logoData, id: agencyId });
      }
      catch (err) {
        handleError(err);
        setLoading(false);
      }
    }
  };

  const handleEdit = async () => {
    if (agencyId) {
      try {
        setLoadingModal(true);
        await updateAgency(agencyId, editForm);
        await handleFileUpload(agencyId);
        showToast(PopupType.Success, "Agencija je uspešno ažurirana");
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

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoData({ id: "", file });
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
          <h1 className="text-3xl">Profil agencije</h1>
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
          {agency.logoUrl && (
            <div className="flex justify-center mb-7 col-span-full">
              <img src={agency.logoUrl} alt="Logo" className="w-30 h-30 rounded-full object-cover" />
            </div>
          )}
          <div className="flex flex-col mb-3">
            <span className="font-bold">Naziv agencije:</span>
            <span>{agency.name}</span>
          </div>

          <div className="flex flex-col mb-3">
            <span className="font-bold">PIB:</span>
            <span>{agency.pib || "N/A"}</span>
          </div>

          <div className="flex flex-col mb-3">
            <span className="font-bold">Email:</span>
            <span>{agency.email}</span>
          </div>

          <div className="flex flex-col mb-3">
            <span className="font-bold">Telefon:</span>
            <span>{agency.phone}</span>
          </div>

          <div className="flex flex-col mb-3">
            <span className="font-bold">Grad:</span>
            <span>{agency.city || "/"}</span>
          </div>

          <div className="flex flex-col mb-3">
            <span className="font-bold">Adresa:</span>
            <span>{agency.address}</span>
          </div>

          <div className="flex flex-col mb-3">
            <span className="font-bold">Broj žiro računa:</span>
            <span>{agency.bankAccountNumber || "N/A"}</span>
          </div>

          {agency.numberOfBuildings !== undefined && (
            <div className="flex flex-col mb-3">
              <span className="font-bold">Broj zgrada:</span>
              <span>{agency.numberOfBuildings}</span>
            </div>
          )}

          {agency.numberOfApartments !== undefined && (
            <div className="flex flex-col mb-3">
              <span className="font-bold">Broj stanova:</span>
              <span>{agency.numberOfApartments}</span>
            </div>
          )}

          <div className="col-span-full flex flex-col mb-3">
            <span className="font-bold">Opis:</span>
            <span>{agency.description || "/"}</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Uredi agenciju"
        onConfirm={handleEdit}
        loading={loadingModal}
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full flex flex-col items-center">
            <label className="form-label mb-2">Logo:</label>
            <div
              onClick={handleLogoClick}
              className="w-34 h-34 rounded-full border-2 border-dashed border-primary flex items-center justify-center cursor-pointer overflow-hidden hover:bg-primary/10 transition"
            >
              {logoPreview
                ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  )
                : (
                    <span className="text-sm text-primary">Klikni za upload</span>
                  )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-2">Naziv agencije:</label>
            <input
              type="text"
              name="name"
              value={editForm.name || ""}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-2">PIB:</label>
            <input
              type="text"
              name="pib"
              value={editForm.pib || ""}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={editForm.email || ""}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-2">Telefon:</label>
            <input
              type="text"
              name="phone"
              value={editForm.phone || ""}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-2">Grad:</label>
            <input
              type="text"
              name="city"
              value={editForm.city || ""}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold mb-2">Adresa:</label>
            <input
              type="text"
              name="address"
              value={editForm.address || ""}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="flex flex-col col-span-full">
            <label className="font-bold mb-2">Broj žiro računa:</label>
            <input
              type="text"
              name="bankAccountNumber"
              value={editForm.bankAccountNumber || ""}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="flex flex-col col-span-full">
            <label className="font-bold mb-2">Opis:</label>
            <textarea
              name="description"
              value={editForm.description || ""}
              onChange={handleInputChange}
              rows={4}
              className="form-input"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
