import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/SignupPage";
import DashboardPage from "./pages/Dashboard";
import BoardsPage from "./pages/BoardsPage";
import FaqPage from "./pages/FaqPage";
import AboutUsPage from "./pages/AboutUsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/boards"
        element={
          <ProtectedRoute>
            <BoardsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faq"
        element={
          <ProtectedRoute>
            <FaqPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/about-us"
        element={
          <ProtectedRoute>
            <AboutUsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
