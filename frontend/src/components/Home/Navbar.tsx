import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import ToggleButton from "./Toggle.Button";
import Logo from "@/assets/Logo/Logo";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import UserProfile from "../user/UserProfile/User.profile";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu, X } from "lucide-react";

// Navigation links array
const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { data, isLoading, isFetching } = useUserInfoQuery(undefined);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Loading skeleton
  const UserProfileLoading = () => (
    <div className="flex items-center gap-3">
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="hidden md:flex flex-col gap-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-2 w-16" />
      </div>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ${isScrolled
        ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm border-gray-200/50 dark:border-gray-700/50"
        : "bg-transparent border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto  sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center gap-0 sm:gap-4 lg:gap-6">
              {/* Mobile Menu Button - Visible on mobile and tablet */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="h-9 w-9 sm:h-10 sm:w-10 relative"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200" />
                  ) : (
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200" />
                  )}
                </Button>
              </div>

              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-0 sm:gap-3 group flex-shrink-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <Logo />
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                </div>
                <span className="font-bold text-sm xs:text-base sm:text-lg lg:text-xl bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                  DigitalWallet
                </span>
              </Link>

              {/* Desktop Navigation - Hidden on mobile/tablet */}
              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList className="gap-1">
                  {navigationLinks.map((link) => (
                    <NavigationMenuItem key={link.href}>
                      <NavigationMenuLink
                        asChild
                        className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${location.pathname === link.href
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                      >
                        <Link to={link.href}>
                          {link.label}
                          <span
                            className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-200 group-hover:w-4/5 group-hover:left-[10%] ${location.pathname === link.href ? "w-4/5 left-[10%]" : ""
                              }`}
                          />
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right Side - Theme Toggle and Auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle - Hidden on mobile, visible on tablet+ */}
              <div className="hidden sm:block">
                <ToggleButton />
              </div>

              {/* User Profile or Auth Buttons */}
              {isLoading || isFetching ? (
                <UserProfileLoading />
              ) : data?.data ? (
                <div className="relative">
                  <UserProfile data={data} />
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Sign In Button - Hidden on mobile, visible on tablet+ */}
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex text-xs sm:text-sm login-user hover:bg-gray-100 dark:hover:bg-gray-800 h-8 sm:h-9 px-2 sm:px-3"
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>

                  {/* Get Started Button */}
                  <Button
                    asChild
                    size="sm"
                    className="text-[11px] sm:text-sm reg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-8 sm:h-9 px-1 sm:px-4"
                  >
                    <Link to="/register" className="whitespace-nowrap">
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}

              {/* Mobile Theme Toggle - Visible only on mobile */}
              <div className="sm:hidden">
                <ToggleButton />
              </div>
            </div>
          </div>
        </div>


        {/* Mobile Navigation Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <div className="fixed top-14 sm:top-16 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-2xl animate-in slide-in-from-top-5 duration-300">
              <nav className="py-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <div className="space-y-1 px-2">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-3 text-base font-medium transition-all duration-200 rounded-lg ${location.pathname === link.href
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Buttons for non-authenticated users */}
                {!data?.data && (
                  <div className="px-3 pt-4 pb-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <div className="space-y-3">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-center h-11 text-base"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/login">
                          Sign In
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full justify-center h-11 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/register">
                          Get Started
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Additional mobile menu items for authenticated users */}
                {data?.data && (
                  <div className="px-3 pt-4 pb-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <div className="space-y-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        Settings
                      </Link>
                    </div>
                  </div>
                )}
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}