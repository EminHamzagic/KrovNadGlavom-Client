import { useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { UserToAdd } from "../../types/user";
import type { CompanyToAdd, LogoUpload } from "../../types/company";
import { PopupType, useToast } from "../../hooks/useToast";
import { createCompany, uploadCompanyLogo } from "../../services/companyService";
import { registerUser } from "../../services/userService";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { handleError } from "../../utils/handleError";

interface Props {
  registerData: UserToAdd;
  setStep: Dispatch<SetStateAction<number>>;
}

export default function CompanyCreateForm({ registerData, setStep }: Props) {
  const [companyData, setCompanyData] = useState<CompanyToAdd>({
    name: "",
    pIB: "",
    address: "",
    email: "",
    phone: "",
    city: "",
    description: "",
    bankAccountNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoData, setLogoData] = useState<LogoUpload | null>(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (key: keyof CompanyToAdd, value: any) => {
    setCompanyData(prev => ({
      ...prev,
      [key]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [key]: "",
    }));
  };

  const validateData = (data: CompanyToAdd) => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim())
      newErrors.name = "Naziv je obavezan";
    if (!data.pIB.trim())
      newErrors.pIB = "PIB je obavezan";
    if (!data.address.trim())
      newErrors.address = "Adresa je obavezna";
    if (!data.city.trim())
      newErrors.city = "Grad je obavezan";
    if (!data.email.trim())
      newErrors.email = "Email je obavezan";
    if (!data.phone.trim())
      newErrors.phone = "Broj telefona je obavezan";
    if (!data.bankAccountNumber.trim())
      newErrors.bankAccountNumber = "Broj bankovnog računa je obavezan";

    return newErrors;
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

  const handleRegister = async (companyId: string) => {
    try {
      await registerUser({ ...registerData, constructionCompanyId: companyId });

      showToast(PopupType.Success, "Registracija je bila uspešna. Molimo vas prijavite se");
      navigate("/login");
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (companyId: string) => {
    if (logoData) {
      try {
        await uploadCompanyLogo({ ...logoData, id: companyId });
      }
      catch (err) {
        handleError(err);
        setLoading(false);
      }
    }
  };

  const handleCompanyCreate = async () => {
    const validationErrors = validateData(companyData);

    if (Object.keys(validationErrors).length > 0) {
      showToast(PopupType.Danger, "Nevalidni podaci, molimo vas ponovo proverite");
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const companyId = await createCompany(companyData);

      await handleFileUpload(companyId);
      await handleRegister(companyId);
    }
    catch (err) {
      handleError(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-white rounded-2xl flex-col justify-center px-6 py-12 lg:px-8 shadow-lg p-6 w-90 sm:w-[45rem] z-10 relative">
      <div className="absolute top-3 left-3">
        <button className="cursor-pointer hover:text-primary-dark-light transition duration-300" onClick={() => setStep(1)}><ArrowLeft /></button>
      </div>
      <div className="flex justify-center">
        <h1 className="text-3xl">Podaci kompanije</h1>
      </div>
      <div className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="col-span-1 sm:col-span-2 flex flex-col items-center">
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

          <div className={`col-span-1 ${errors.name && "has-error"}`}>
            <label className="form-label">Naziv:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Unesite naziv"
              value={companyData.name}
              onChange={e => handleChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-danger text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className={`col-span-1 ${errors.pIB && "has-error"}`}>
            <label className="form-label">PIB:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Unesite PIB"
              value={companyData.pIB}
              onChange={e => handleChange("pIB", e.target.value)}
            />
            {errors.pIB && (
              <p className="text-danger text-sm mt-1">{errors.pIB}</p>
            )}
          </div>

          <div className={`col-span-1 ${errors.email && "has-error"}`}>
            <label className="form-label">Email:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Unesite email"
              value={companyData.email}
              onChange={e => handleChange("email", e.target.value)}
            />
            {errors.email && (
              <p className="text-danger text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className={`col-span-1 ${errors.phone && "has-error"}`}>
            <label className="form-label">Broj telefona:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Unesite broj telefona"
              value={companyData.phone}
              onChange={e => handleChange("phone", e.target.value)}
            />
            {errors.phone && (
              <p className="text-danger text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className={`col-span-1 ${errors.city && "has-error"}`}>
              <label className="form-label">Grad:</label>
              <input
                type="text"
                className="form-input"
                placeholder="Unesite grad"
                value={companyData.city}
                onChange={e => handleChange("city", e.target.value)}
              />
              {errors.city && (
                <p className="text-danger text-sm mt-1">{errors.city}</p>
              )}
            </div>
            <div className={`col-span-1 ${errors.address && "has-error"}`}>
              <label className="form-label">Adresa:</label>
              <input
                type="text"
                className="form-input"
                placeholder="Unesite adresu"
                value={companyData.address}
                onChange={e => handleChange("address", e.target.value)}
              />
              {errors.address && (
                <p className="text-danger text-sm mt-1">{errors.address}</p>
              )}
            </div>
            <div className={`col-span-1 ${errors.bankAccountNumber && "has-error"}`}>
              <label className="form-label">Broj računa:</label>
              <input
                type="text"
                className="form-input"
                placeholder="Unesite broj bankovnog računa"
                value={companyData.bankAccountNumber}
                onChange={e => handleChange("bankAccountNumber", e.target.value)}
              />
              {errors.bankAccountNumber && (
                <p className="text-danger text-sm mt-1">{errors.bankAccountNumber}</p>
              )}
            </div>
          </div>

          <div className={`col-span-1 sm:col-span-2 ${errors.description && "has-error"}`}>
            <label className="form-label">Opis:</label>
            <textarea
              className="form-input h-40"
              placeholder="Unesite opis (opcionalno)"
              value={companyData.description}
              onChange={e => handleChange("description", e.target.value)}
            />
            {errors.description && (
              <p className="text-danger text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <button className="btn btn-primary col-span-1 sm:col-span-2 text-xl" onClick={handleCompanyCreate} disabled={loading}>
            {loading
              ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )
              : (
                  "Kreiraj i registruj se"
                )}
          </button>
        </div>
      </div>
    </div>
  );
}
