import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import UserContextProvider from "./context/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./config";
import LayoutComponent from "./components/LayoutComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import CompanyPage from "./pages/Company/CompanyPage";
import AgencyRequestsPage from "./pages/AgencyRequests/AgencyRequestsPage";
import DiscountRequestsPage from "./pages/DiscountRequestsPage";
import NotFoundPage from "./pages/NotFoundPage";
import BuildingDetailsPage from "./pages/Building/BuildingDetailsPage";
import CreateBuildingPage from "./pages/Building/CreateBuildingPage";
import BuildingsPage from "./pages/Building/BuildingsPage";
import BuildingEditPage from "./pages/Building/BuildingEditPage";
import RegisterPage from "./pages/RegisterPage";
import { RequireRoleRoute } from "./components/Auth/RequireRoleRoute";
import AgencyPage from "./pages/Agency/AgencyPage";
import ContractsPage from "./pages/Contract/ContractsPage";
import ApartmentsPage from "./pages/Apartment/ApartmentsPage";
import ApartmentDetailsPage from "./pages/Apartment/ApartmentDetailsPage";
import ApartmentBuyPage from "./pages/Apartment/ApartmentBuyPage";
import ContractDetailsPage from "./pages/Contract/ContractDetailsPage";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserContextProvider>
        <Routes>
          {/* Auth rute */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<LayoutComponent />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<HomePage />} />

              {/* Zgrada rute */}
              <Route path="/buildings" element={<BuildingsPage />} />
              <Route path="/buildings/:buildingId" element={<BuildingDetailsPage />} />
              <Route
                path="/buildings/:buildingId/edit"
                element={
                  <RequireRoleRoute roles={["Company"]} element={<BuildingEditPage />} />
                }
              />
              <Route
                path="/buildings/create"
                element={
                  <RequireRoleRoute roles={["Company"]} element={<CreateBuildingPage />} />
                }
              />

              {/* Kompanija rute */}
              <Route
                path="/company/:companyId"
                element={
                  <RequireRoleRoute roles={["Company"]} element={<CompanyPage />} />
                }
              />

              {/* Zahtevi rute */}
              <Route
                path="/requests"
                element={
                  <RequireRoleRoute roles={["Company", "Agency"]} element={<AgencyRequestsPage />} />
                }
              />

              {/* Popusti rute */}
              <Route path="/discount-requests" element={<DiscountRequestsPage />} />

              {/* Agencija rute */}
              <Route
                path="/agency/:agencyId"
                element={
                  <RequireRoleRoute roles={["Agency"]} element={<AgencyPage />} />
                }
              />

              {/* Ugovori rute */}
              <Route
                path="/contracts"
                element={
                  <RequireRoleRoute roles={["Agency", "User"]} element={<ContractsPage />} />
                }
              />
              <Route
                path="/contracts/:contractId"
                element={
                  <RequireRoleRoute roles={["Agency", "User"]} element={<ContractDetailsPage />} />
                }
              />

              {/* Stanovi(Apartments) rute */}
              <Route
                path="/apartments"
                element={
                  <RequireRoleRoute roles={["User"]} element={<ApartmentsPage />} />
                }
              />
              <Route
                path="/apartments/:apartmentId"
                element={
                  <RequireRoleRoute roles={["User"]} element={<ApartmentDetailsPage />} />
                }
              />
              <Route
                path="/apartments/:apartmentId/buy"
                element={
                  <RequireRoleRoute roles={["User"]} element={<ApartmentBuyPage />} />
                }
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
