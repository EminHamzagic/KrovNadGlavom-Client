import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import UserContextProvider from "./context/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./config";
import LayoutComponent from "./components/LayoutComponent";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserContextProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<LayoutComponent />}>
              <Route path="/" element={<HomePage />} />
            </Route>
          </Route>
        </Routes>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
