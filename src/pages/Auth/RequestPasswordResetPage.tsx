import { useState } from "react";
import { sendPasswordResetRequest } from "../../services/userService";
import { PopupType, useToast } from "../../hooks/useToast";
import { handleError } from "../../utils/handleError";
import { useNavigate } from "react-router";

export default function RequestPasswordResetPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSendRequest = async () => {
    if (!email.trim()) {
      showToast(PopupType.Danger, "Email ne sme biti prazan");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast(PopupType.Danger, "Email nije validan");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetRequest(email);

      showToast(PopupType.Success, "Zahtev za resetovanje lozinke je uspešno poslat. Molimo vas proverite vaš email", 8000);
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

      <div className="flex bg-white rounded-2xl flex-col justify-between items-center px-6 py-12 lg:px-8 shadow-lg p-6 w-90 sm:w-[35rem] z-10 h-60">
        <div className="w-full">
          <label className="text-xl">Pošaljite zahtev za resetovanje lozinke:</label>
          <input type="text" className="form-input" value={email} placeholder="Unesite vaš email" onChange={e => setEmail(e.target.value)} />
        </div>
        <button className="btn btn-primary w-full" onClick={handleSendRequest} disabled={loading}>
          {loading
            ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )
            : (
                "Pošalji"
              )}
        </button>
      </div>
    </div>
  );
}
