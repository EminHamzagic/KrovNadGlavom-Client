import { useEffect, useState } from "react";
import { PopupType, useToast } from "../../hooks/useToast";
import { resetUserPassword } from "../../services/userService";
import { useLocation, useNavigate } from "react-router";
import { handleError } from "../../utils/handleError";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { showToast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const locToken = params.get("token");

    if (!locToken) {
      navigate("/login", { replace: true });
    }
    else {
      setToken(locToken);
    }
  }, []);

  const validatePassword = (): boolean => {
    if (newPassword !== confirmPassword) {
      showToast(PopupType.Danger, "Lozinke se moraju poklapati");
      return false;
    }
    const passwordRegex
      = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%.])[A-Za-z\d!@#$%.]{7,}$/;
    if (!passwordRegex.test(newPassword)) {
      showToast(PopupType.Danger, "Lozinka mora imati najmanje 7 karaktera, jedno veliko i malo slovo, jedan broj i jedan specijalan znak (!@#$%.)", 8000);
      return false;
    }

    return true;
  };

  const handleReset = async () => {
    if (!validatePassword()) {
      return;
    }

    try {
      setLoading(true);
      await resetUserPassword(newPassword, token);

      showToast(PopupType.Success, "Uspešno ste resetovali lozinku. Molimo vas da nastavite sa prijavom", 8000);
      navigate("/login", { replace: true });
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen items-center relative overflow-y-scroll py-10">
      <div className="absolute inset-0">
        <img src="/LoginBackground.jpg" alt="image" className="fixed inset-0 h-full w-full object-cover" />
      </div>

      <div className="flex bg-white rounded-2xl flex-col justify-between px-6 py-12 lg:px-8 shadow-lg p-6 w-90 sm:w-[35rem] z-10">
        <h1 className="text-3xl mb-6">Resetujte vašu lozinku</h1>
        <div className="w-full mb-5">
          <label>Nova lozinka</label>
          <div className="mt-2 relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-input"
              placeholder="Unesite novu lozinku"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
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
        </div>
        <div className="w-full">
          <label>Potvrdite novu lozinku</label>
          <div className="mt-2 relative">
            <input
              id="password"
              type={showConfirmPassword ? "text" : "password"}
              name="password"
              className="form-input"
              placeholder="Potvrdite novu lozinku"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button className="btn btn-primary w-full mt-5" onClick={handleReset} disabled={loading}>
          {loading
            ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )
            : (
                "Resetuj lozinku"
              )}
        </button>
      </div>
    </div>
  );
}
