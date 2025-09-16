import { useContext, useState } from "react";
import logo from "/KrovNadGlavomLogo.png";
import type { LoginData } from "../types/user";
import { useNavigate } from "react-router";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { PopupType, useToast } from "../hooks/useToast";
import { loginUser, loginUserGoogle } from "../services/userService";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const { setLoginData } = useContext(UserContext);
  const [loginInput, setLoginInput] = useState<LoginData>({
    email: "",
    password: "",
  });
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const setEmail = (email: string) => {
    setLoginInput(prev => (
      { ...prev, email }
    ));
  };

  const setPassword = (password: string) => {
    setLoginInput(prev => (
      { ...prev, password }
    ));
  };

  const handleLogin = async () => {
    if (loginInput.email !== "" && loginInput.password !== "") {
      try {
        setLoading(true);
        const data = await loginUser(loginInput);

        setLoginData(data.accessToken ?? "", data.refreshToken ?? "", data);

        showToast(PopupType.Success, "Uspešno ste se prijavili");
        navigate("/dashboard");
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
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true);
      const data = await loginUserGoogle(credentialResponse.credential ?? "");

      setLoginData(data.accessToken ?? "", data.refreshToken ?? "", data);

      showToast(PopupType.Success, "Uspešno ste se prijavili");
      navigate("/dashboard");
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        showToast(PopupType.Danger, err.response?.data);
      }
      else {
        showToast(PopupType.Danger, `Unkown error: ${err}`);
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen relative">
      <div className="absolute inset-0">
        <img src="/LoginBackground.jpg" alt="image" className="fixed inset-0 h-full w-full object-cover" />
      </div>

      <div className="flex bg-white rounded-2xl flex-col justify-center px-6 py-12 lg:px-8 shadow-lg p-6 w-90 sm:w-[30rem] z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img src={logo} alt="KrovNad Glavom" className="mx-auto h-auto w-full" />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label className="text-sm/6 font-medium">Email</label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input"
                  value={loginInput.email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm/6 font-medium">Lozinka</label>
                <div className="text-sm">
                  <a href="#" tabIndex={-1} className="font-semibold text-primary-dark-light hover:text-primary transition duration-300">Zaboravili ste lozinku?</a>
                </div>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input pr-10"
                  value={loginInput.password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      handleLogin();
                  }}
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

            <div>
              <button type="button" onClick={handleLogin} className="btn btn-primary w-full flex justify-center items-center" disabled={loading}>
                {loading
                  ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )
                  : (
                      "Prijavi se"
                    )}
              </button>
            </div>
          </div>

          <div className="mt-3">

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => showToast(PopupType.Danger, "Neuspela prijava")}
            />
          </div>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Nemate profil?
            <a href="#" className="font-semibold text-primary-dark-light hover:text-primary transition duration-300"> Registrujte se sada!</a>
          </p>
        </div>
      </div>
    </div>
  );
}
