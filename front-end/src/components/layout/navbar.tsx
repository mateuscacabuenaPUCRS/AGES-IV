import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import LogoIcon from "@/assets/Logo.svg?react";
import StarIcon from "@/assets/Star.svg?react";
import HomeIcon from "@/assets/Home.svg?react";
import VectorIcon from "@/assets/Vector.svg?react";
import DiscoverIcon from "@/assets/Discovery.svg?react";
import ActivityIcon from "@/assets/Activity.svg?react";
import { Menu, X, Heart } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { NAVBAR_HEIGHT_CLASS, Z_INDEX } from "@/constant/layout";
import { getUserAvatar } from "@/constant/defaultAvatar";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useUser();
  const isAuthenticated = !!user;
  const avatarUrl = getUserAvatar(user?.imageUrl);

  const getFirstName = (fullName: string) => {
    return fullName.split(" ")[0];
  };

  const linkStyles = "flex items-center gap-2.5 px-4 py-2 rounded-3xl transition-colors";
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `${linkStyles} ${
      isActive
        ? "bg-[var(--color-components)] text-[var(--color-background)]"
        : "text-[var(--color-components)] hover:bg-[var(--color-components)] hover:text-[var(--color-background)]"
    }`;
  };

  return (
    <nav
      className={`bg-[var(--color-components-2)] sticky top-0 w-full z-${Z_INDEX.NAVBAR} ${NAVBAR_HEIGHT_CLASS} flex items-center justify-between shadow-md px-8`}
    >
      <div className="flex-shrink-0">
        <Link to="/">
          <LogoIcon className="h-12 w-auto fill-current text-[var(--color-components)]" />
        </Link>
      </div>

      {/*DESKTOP*/}
      <div className="hidden lg:flex flex-shrink-0">
        <NavLink to="/" className={getNavLinkClass}>
          <HomeIcon className="h-5 w-5 fill-current" />
          <strong>Home</strong>
        </NavLink>
      </div>
      {isAuthenticated && user.role == "ADMIN" && (
        <div className="hidden lg:flex flex-shrink-0">
          <NavLink to="/dashboard" className={getNavLinkClass}>
            <ActivityIcon className="h-5 w-5 fill-current" />
            <strong>Dashboard</strong>
          </NavLink>
        </div>
      )}
      <div className="hidden lg:flex flex-shrink-0">
        <NavLink to="/campanhas" className={getNavLinkClass}>
          <StarIcon className="h-5 w-5 fill-current" />
          <strong>Campanhas</strong>
        </NavLink>
      </div>
      {(!isAuthenticated || user.role !== "ADMIN") && (
        <div className="hidden lg:flex flex-shrink-0">
          <NavLink to="/doacao" className={getNavLinkClass}>
            <Heart className="h-5 w-5 stroke-current fill-none" strokeWidth={2} />
            <strong>Doar</strong>
          </NavLink>
        </div>
      )}
      {isAuthenticated && user.role == "ADMIN" && (
        <div className="hidden lg:flex flex-shrink-0">
          <NavLink to="/noticias-eventos" className={getNavLinkClass}>
            <DiscoverIcon className="h-5 w-5 fill-current" />
            <strong>Notícias & Eventos</strong>
          </NavLink>
        </div>
      )}
      <div className="flex-shrink-0">
        {/*DESKTOP*/}
        <div className="hidden lg:flex items-center">
          {isAuthenticated ? (
            <Link
              to="/perfil"
              className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-black/10 transition-colors max-w-40"
            >
              <img
                src={avatarUrl}
                alt={`Avatar de ${user.fullname}`}
                className="h-8 w-8 rounded-full object-cover"
              />
              <strong className="text-[var(--color-components)] font-semibold ">
                {getFirstName(user.fullname)}
              </strong>
            </Link>
          ) : (
            <NavLink to="/login" className={getNavLinkClass}>
              <strong>Login/Registre-se</strong>
              <VectorIcon className="h-5 w-5 fill-current" />
            </NavLink>
          )}
        </div>

        <button onClick={() => setIsOpen(true)} className="lg:hidden p-2">
          <Menu className="h-6 w-6 text-[var(--color-components)]" />
        </button>
      </div>

      {/*MOBILE*/}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)}></div>
          <div className="relative w-64 bg-[var(--color-components-2)] h-full shadow-lg p-6 flex flex-col gap-4">
            <button onClick={() => setIsOpen(false)} className="flex justify-end">
              <X className="h-6 w-6 text-[var(--color-components)]" />
            </button>
            {isAuthenticated && (
              <div className="flex flex-col gap-3">
                <Link
                  to="/perfil"
                  className="flex gap-3 items-center mb-2 hover:bg-black/10 p-2 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <img
                    src={avatarUrl}
                    alt={`Avatar de ${user.fullname}`}
                    className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                  />
                  <strong className="text-[var(--color-components)] truncate font-semibold text-lg">
                    {getFirstName(user.fullname)}
                  </strong>
                </Link>
                <hr className="border-[var(--color-components)]" />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <NavLink to="/" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
                <HomeIcon className="h-5 w-5 fill-current flex-shrink-0" />
                <strong>Home</strong>
              </NavLink>

              {isAuthenticated && user.role === "ADMIN" && (
                <NavLink
                  to="/dashboard"
                  className={getNavLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  <ActivityIcon className="h-5 w-5 fill-current flex-shrink-0" />
                  <strong>Dashboard</strong>
                </NavLink>
              )}

              <NavLink to="/campanhas" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
                <StarIcon className="h-5 w-5 fill-current flex-shrink-0" />
                <strong>Campanhas</strong>
              </NavLink>

              {(!isAuthenticated || user.role !== "ADMIN") && (
                <NavLink to="/doacao" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
                  <Heart
                    className="h-5 w-5 stroke-current fill-none flex-shrink-0"
                    strokeWidth={2}
                  />
                  <strong>Doar</strong>
                </NavLink>
              )}

              {isAuthenticated && user.role === "ADMIN" && (
                <NavLink
                  to="/noticias-eventos"
                  className={getNavLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  <DiscoverIcon className="h-5 w-5 fill-current flex-shrink-0" />
                  <strong>Notícias & Eventos</strong>
                </NavLink>
              )}

              {!isAuthenticated && (
                <NavLink to="/login" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
                  <VectorIcon className="h-5 w-5 fill-current flex-shrink-0" />
                  <strong>Login/Registre-se</strong>
                </NavLink>
              )}

              {isAuthenticated && (
                <NavLink to="/perfil" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
                  <svg
                    className="h-5 w-5 stroke-current flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  <strong>Perfil</strong>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
