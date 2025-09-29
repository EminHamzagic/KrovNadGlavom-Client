import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { verifyUserEmail } from "../../services/userService";
import { PopupType, useToast } from "../../hooks/useToast";
import { handleError } from "../../utils/handleError";

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { showToast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const verify = async () => {
      try {
        await verifyUserEmail(token);

        showToast(PopupType.Success, "Verifikacija uspešna");
        setIsSuccess(true);
      }
      catch (err) {
        handleError(err);
        setIsSuccess(false);
      }
      finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  return (
    <div className="flex justify-center w-full min-h-screen items-center relative overflow-y-scroll py-10">
      <div className="absolute inset-0">
        <img src="/LoginBackground.jpg" alt="image" className="fixed inset-0 h-full w-full object-cover" />
      </div>

      <div className="flex bg-white rounded-2xl flex-col justify-between items-center px-6 py-12 lg:px-8 shadow-lg p-6 w-90 sm:w-[35rem] z-10 h-60">
        {loading
          ? <h1 className="text-3xl">Verifikovanje...</h1>
          : (
              <div>
                <h1 className="text-3xl">{isSuccess ? "Verifikacija uspešna!" : "Neuspešna verifikacija"}</h1>
                <p className="text-xl">{isSuccess ? "Klikom na dugme ispod možete nastaviti sa prijavom" : "Verifikacija nije uspela, probajte ponovo"}</p>
              </div>
            )}
        <button className="btn btn-primary w-full" onClick={() => navigate("/login")} disabled={loading}>
          {loading
            ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )
            : (
                "Prijava"
              )}
        </button>
      </div>
    </div>
  );
}
