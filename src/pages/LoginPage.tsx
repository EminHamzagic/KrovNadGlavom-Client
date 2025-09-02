import { useContext, useState } from "react";
import logo from "/logo-transparent.png";
import type { LoginData } from "../types/user";
import { useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "../config";
import { UserContext } from "../context/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { PopupType, useToast } from "../hooks/useToast";

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const { setLoginData } = useContext(UserContext);
  const [loginInput, setLoginInput] = useState<LoginData>({
    email: "",
    password: "",
  });
  const { showToast } = useToast();

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginInput.email !== "" && loginInput.password !== "") {
      try {
        setLoading(true);
        const { data } = await axios.post(`${API_URL}/Users/login`, loginInput);

        setLoginData(data.token, data);

        showToast(PopupType.Success, "Uspešno ste se prijavili");
        navigate("/");
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
      const { data } = await axios.post(`${API_URL}/Users/google`, {
        idToken: credentialResponse.credential,
      });

      setLoginData(data.token, data);

      showToast(PopupType.Success, "Uspešno ste se prijavili");
      navigate("/");
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        showToast(PopupType.Danger, err.response?.data);
      }
      else {
        showToast(PopupType.Danger, `Unkown error: ${err}`);
      }
    }
  };

  return (
    <div className="flex justify-center items-center bg-primary w-full h-screen">
      <div className="flex bg-white rounded-2xl flex-col justify-center px-6 py-12 lg:px-8 shadow-lg p-6 w-90 sm:w-[30rem]">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img src={logo} alt="Your Company" className="mx-auto h-50 w-auto" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Prijavi se</h2>
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
                  <a href="#" tabIndex={-1} className="font-semibold text-indigo-400 hover:text-indigo-300">Zaboravili ste lozinku?</a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="form-input"
                  value={loginInput.password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <button onClick={handleLogin} className="btn btn-primary w-full flex justify-center items-center">
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
            <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300"> Registrujte se sada!</a>
          </p>
        </div>
      </div>
    </div>
  );
}
