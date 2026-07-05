import { useAdminAuth } from "@/store/adminAuth";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";

const Admin = () => {
  const isAuthenticated = useAdminAuth((s) => s.isAuthenticated);
  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
};

export default Admin;
