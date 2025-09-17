import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import UserContextProvider from "./context/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./config";
import LayoutComponent from "./components/LayoutComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import BuildingsPage from "./pages/BuildingsPage";
import CompanyPage from "./pages/CompanyPage";
import AgencyRequestsPage from "./pages/AgencyRequestsPage";
import DiscountRequestsPage from "./pages/DiscountRequestsPage";
import NotFoundPage from "./pages/NotFoundPage";
import BuildingDetailsPage from "./pages/BuildingDetailsPage";
import CreateBuildingPage from "./pages/CreateBuildingPage";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserContextProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<LayoutComponent />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<HomePage />} />

              <Route path="/buildings" element={<BuildingsPage />} />
              <Route path="/buildings/:buildingId" element={<BuildingDetailsPage />} />
              <Route path="/buildings/create" element={<CreateBuildingPage />} />

              <Route path="/company" element={<CompanyPage />} />
              <Route path="/agency-requests" element={<AgencyRequestsPage />} />
              <Route path="/discount-requests" element={<DiscountRequestsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
