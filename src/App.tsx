import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import UserContextProvider from "./context/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./config";
import LayoutComponent from "./components/LayoutComponent";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserContextProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<LayoutComponent />}>
            <Route path="/" element={<HomePage />} />
            {/* Add more nested routes here that share the layout */}
          </Route>
        </Routes>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
