import { useEffect, useState, type ReactNode } from "react";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import TourGuide from "../Tour/TourGuide";

interface IProps {
  children: ReactNode;
}

export default function CommonLayout({ children }: IProps) {
    const { data: userData, isLoading } = useUserInfoQuery(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>();

  useEffect(() => {
    if (userData?.data) {
      setIsAuthenticated(true);
      setUserRole(userData.data.role);
    } else {
      setIsAuthenticated(false);
      setUserRole(undefined);
    }
  }, [userData]);
  return (
    <div className=" min-h-screen flex flex-col">
      <Navbar />
      <div className="grow-1">{children}</div>
      {!isLoading && (
        <TourGuide isAuthenticated={isAuthenticated} userRole={userRole} />
      )}
      <Footer />
    </div>
  );
}
