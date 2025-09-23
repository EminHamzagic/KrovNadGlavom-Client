import { useRef, useState } from "react";
import type { UserToAdd } from "../types/user";
import { Building, Building2, Eye, EyeOff, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { PopupType, useToast } from "../hooks/useToast";
import { registerUser, uploadUserPfp } from "../services/userService";
import axios from "axios";
import CompanyCreateForm from "./Company/CompanyCreateForm";
import type { LogoUpload } from "../types/company";
import AgencyCreateForm from "./Agency/AgencyCreateForm";

export default function RegisterPage() {
  const [registerData, setRegisterData] = useState<UserToAdd>({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [regType, setRegType] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [activeForm, setActiveForm] = useState<number>(1);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoData, setLogoData] = useState<LogoUpload | null>(null);

  const roles = ["Korisnik", "Agencija", "Građevinska firma"];
  const navigate = useNavigate();

  const { showToast } = useToast();

  const handleChange = (key: keyof UserToAdd, value: any) => {
    setRegisterData(prev => ({
      ...prev,
      [key]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [key]: "",
    }));
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

  const validateData = (data: UserToAdd) => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim())
      newErrors.name = "Ime je obavezno";
    if (!data.lastname.trim())
      newErrors.lastname = "Prezime je obavezno";
    if (!data.username.trim())
      newErrors.username = "Korisničko ime je obavezno";
    if (!data.email.trim()) {
      newErrors.email = "Email je obavezan";
    }
    else {
      const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        newErrors.email = "Email nije validan";
      }
    }
    if (!data.password.trim()) {
      newErrors.password = "Lozinka je obavezna";
    }
    else {
      const passwordRegex
      = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%.])[A-Za-z\d!@#$%.]{7,}$/;
      if (!passwordRegex.test(data.password)) {
        newErrors.password
        = "Lozinka mora imati najmanje 7 karaktera, jedno veliko i malo slovo, jedan broj i jedan specijalan znak (!@#$%.)";
      }
    }
    if (!data.role.trim())
      newErrors.role = "Uloga je obavezna";

    return newErrors;
  };

  const handleFileUpload = async (userId: string) => {
    if (logoData) {
      try {
        await uploadUserPfp({ ...logoData, id: userId });
      }
      catch (err) {
        if (axios.isAxiosError(err)) {
          showToast(PopupType.Danger, err.response?.data);
        }
        else {
          showToast(PopupType.Danger, `Unkown error: ${err}`);
        }
      }
    }
  };

  const handleRegister = async () => {
    const validationErrors = validateData(registerData);

    if (Object.keys(validationErrors).length > 0) {
      showToast(PopupType.Danger, "Nevalidni podaci, molimo vas ponovo proverite");
      setErrors(validationErrors);
      return;
    }

    if (regType === "Korisnik") {
      try {
        setLoading(true);
        const userId = await registerUser(registerData);

        await handleFileUpload(userId);

        showToast(PopupType.Success, "Registracija je bila uspešna. Molimo vas prijavite se");
        navigate("/login");
      }
      catch (err) {
        if (axios.isAxiosError(err)) {
          showToast(PopupType.Danger, err.response?.data);
        }
        else {
          showToast(PopupType.Danger, `Unkown error: ${err}`);
        }
      }
      finally {
        setLoading(false);
      }
    }
    else if (regType === "Agencija") {
      setActiveForm(2);
    }
    else {
      setActiveForm(3);
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen relative overflow-y-scroll py-10">
      <div className="absolute inset-0">
        <img src="/LoginBackground.jpg" alt="image" className="fixed inset-0 h-full w-full object-cover" />
      </div>

      {activeForm === 1 && (
        <div className="flex bg-white rounded-2xl flex-col justify-center px-6 py-12 lg:px-8 shadow-lg p-6 w-90 sm:w-[35rem] z-10">
          <div className="flex justify-center">
            <h1 className="text-3xl">Registracija</h1>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="col-span-1 sm:col-span-2 flex flex-col items-center">
                <label className="form-label mb-2">Profilna slika:</label>
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
                <label className="form-label">Ime:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Unesite ime"
                  value={registerData.name}
                  onChange={e => handleChange("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-danger text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div className={`col-span-1 ${errors.lastname && "has-error"}`}>
                <label className="form-label">Prezime:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Unesite prezime"
                  value={registerData.lastname}
                  onChange={e => handleChange("lastname", e.target.value)}
                />
                {errors.lastname && (
                  <p className="text-danger text-sm mt-1">{errors.lastname}</p>
                )}
              </div>

              <div className={`col-span-1 sm:col-span-2 ${errors.username && "has-error"}`}>
                <label className="form-label">Korisničko ime:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Unesite korisničko ime"
                  value={registerData.username}
                  onChange={e => handleChange("username", e.target.value)}
                />
                {errors.username && (
                  <p className="text-danger text-sm mt-1">{errors.username}</p>
                )}
              </div>
              <div className={`col-span-1 sm:col-span-2 ${errors.email && "has-error"}`}>
                <label className="form-label">Email:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Unesite email"
                  value={registerData.email}
                  onChange={e => handleChange("email", e.target.value)}
                />
                {errors.email && (
                  <p className="text-danger text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div className={`col-span-1 sm:col-span-2 ${errors.password && "has-error"}`}>
                <label className="form-label">Lozinka:</label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input"
                    placeholder="Unesite lozinku"
                    value={registerData.password}
                    onChange={e => handleChange("password", e.target.value)}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-danger text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="form-label">Uloga:</label>
                <div className="flex">
                  {roles.map((role, index) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        const userRole = role === "Korisnik" ? "User" : "Manager";
                        handleChange("role", userRole);
                        setRegType(role);
                      }}
                      className={`flex-1 px-4 py-5 ${index !== 1 && "rounded-lg"} border text-center transition cursor-pointer flex flex-col items-center justify-center
										${index === 0 && "rounded-r-none"}
										${index === 2 && "rounded-l-none"}
              		${
                    regType === role
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                    >
                      {role === "Korisnik" && <UserRound />}
                      {role === "Agencija" && <Building />}
                      {role === "Građevinska firma" && <Building2 />}
                      <span className="text-xs sm:text-base">{role}</span>
                    </button>
                  ))}
                </div>
                {errors.role && (
                  <p className="text-danger text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <button className="btn btn-primary col-span-1 sm:col-span-2 text-xl" onClick={handleRegister} disabled={loading}>
                {loading
                  ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )
                  : (
                      "Registruj se"
                    )}
              </button>
            </div>
            <p className="mt-10 text-center text-sm/6 text-gray-400">
              Već imate profil?
              <Link to="/login" className="font-semibold text-primary-dark-light hover:text-primary transition duration-300"> Prijavite se!</Link>
            </p>
          </div>
        </div>
      )}

      {activeForm === 2 && <AgencyCreateForm registerData={registerData} setStep={setActiveForm} />}
      {activeForm === 3 && <CompanyCreateForm registerData={registerData} setStep={setActiveForm} />}
    </div>
  );
}
