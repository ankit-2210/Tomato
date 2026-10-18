import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";

import ProtectedRoute from "./components/protectedRoute";
import PublicRoute from "./components/publicRoute";

import SelectRole from "./pages/SelectRole";
import Navbar from "./components/Navbar";
import Account from "./pages/Account";
import { useAppData } from "./context/useAppData";
import Restaurant from "./pages/Restaurant/Restaurant";

const AppRoutes = () => {
  const { user } = useAppData();

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public customer homepage */}
        <Route path="/" element={<Home />} />

        {/* Public authentication route */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/select-role" element={<SelectRole />} />

          <Route path="/account" element={<Account />} />

          {/* Restaurant owner dashboard */}
          <Route
            path="/seller"
            element={
              user?.role === "seller" ? (
                <Restaurant />
              ) : (
                <Navigate to="/select-role" replace />
              )
            }
          />
        </Route>
      </Routes>

      <Toaster position="top-right" />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
