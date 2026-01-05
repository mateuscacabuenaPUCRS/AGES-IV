import { SearchBar } from "@/components/ui/search-bar";
import { CampaignCardProfileCompact } from "@/components/ui/campaignCard/campaingCardProfileCompact";
import { Pagination } from "@/components/ui/Pagination";
import type { UserListItem, UserFilter } from "../hooks/useAdminUsers";

interface AdminUserListProps {
  users: UserListItem[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  userFilter: UserFilter;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: UserFilter) => void;
  onUserClick: (user: UserListItem) => void;
}

const FILTER_TABS = [
  { label: "Todos", value: "all" as UserFilter },
  { label: "Doadores", value: "donors" as UserFilter },
  { label: "Administradores", value: "admins" as UserFilter },
];

export function AdminUserList({
  users,
  currentPage,
  totalPages,
  loading,
  userFilter,
  onPageChange,
  onFilterChange,
  onUserClick,
}: AdminUserListProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-[#005172]">Lista de Usuários</h3>

      <div className="flex justify-center w-full">
        <div className="flex items-center p-1 rounded-[6px] bg-[var(--color-components)] w-fit">
          {FILTER_TABS.map(({ label, value }) => {
            const isActive = userFilter === value;
            return (
              <button
                key={value}
                className={`cursor-pointer px-2 sm:px-3 py-[6px] rounded min-w-[70px] sm:min-w-[80px] transition-colors ${
                  isActive
                    ? "bg-white text-[var(--color-components)]"
                    : "bg-[var(--color-components)] text-white"
                }`}
                onClick={() => onFilterChange(value)}
              >
                <span className="text-xs sm:text-sm font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full">
        <SearchBar />
      </div>

      {loading ? (
        <div className="flex flex-col gap-3 w-full min-h-[200px]">
          <div className="w-full py-8 text-center text-[#005172]">Carregando usuários...</div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 w-full min-h-[200px]">
            {users.length > 0 ? (
              users.map((user) => (
                <CampaignCardProfileCompact
                  key={user.data.id}
                  profileName={user.data.fullName}
                  role={user.type === "donor" ? "donor" : "admin"}
                  email={user.data.email}
                  showRole={true}
                  imageUrl={user.data.imageUrl}
                  onAction={() => onUserClick(user)}
                />
              ))
            ) : (
              <div className="w-full mx-auto py-8 bg-blue-100 text-[#005172] text-center font-medium border border-[#005172] rounded-lg">
                Nenhum usuário encontrado.
              </div>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}
