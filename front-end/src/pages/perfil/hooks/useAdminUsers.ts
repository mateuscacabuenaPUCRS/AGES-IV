import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getDonors, type DonorItem } from "@/services/donors";
import { listAdmins, type AdminItem } from "@/services/admin";

export type UserListItem = { type: "donor"; data: DonorItem } | { type: "admin"; data: AdminItem };

export type UserFilter = "all" | "donors" | "admins";

const USERS_PAGE_SIZE = 10;

export function useAdminUsers(isAdmin: boolean) {
  const [searchParams] = useSearchParams();
  const [currentUsersPage, setCurrentUsersPage] = useState(1);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [allUsers, setAllUsers] = useState<UserListItem[]>([]);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userFilter, setUserFilter] = useState<UserFilter>("all");

  // Fetch all users (donors and admins)
  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;

    try {
      setLoadingUsers(true);

      const [donorsResponse, adminsResponse] = await Promise.all([
        getDonors(1, 100),
        listAdmins(1, 100),
      ]);

      const combinedUsers: UserListItem[] = [
        ...donorsResponse.data.map((donor) => ({ type: "donor" as const, data: donor })),
        ...adminsResponse.data.map((admin) => ({ type: "admin" as const, data: admin })),
      ].sort((a, b) => {
        const nameA = a.data.fullName;
        const nameB = b.data.fullName;
        return nameA.localeCompare(nameB);
      });

      setAllUsers(combinedUsers);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoadingUsers(false);
    }
  }, [isAdmin]);

  // Filter and paginate users
  useEffect(() => {
    if (!isAdmin) return;

    const searchTerm = searchParams.get("search")?.toLowerCase() || "";

    let filtered = allUsers;
    if (userFilter === "donors") {
      filtered = allUsers.filter((u) => u.type === "donor");
    } else if (userFilter === "admins") {
      filtered = allUsers.filter((u) => u.type === "admin");
    }

    if (searchTerm) {
      filtered = filtered.filter((u) => u.data.fullName.toLowerCase().includes(searchTerm));
    }

    const totalPages = Math.ceil(filtered.length / USERS_PAGE_SIZE);
    const startIndex = (currentUsersPage - 1) * USERS_PAGE_SIZE;
    const endIndex = startIndex + USERS_PAGE_SIZE;
    const paginatedUsers = filtered.slice(startIndex, endIndex);

    setUsers(paginatedUsers);
    setUsersTotalPages(totalPages);
  }, [allUsers, userFilter, searchParams, currentUsersPage, isAdmin]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentUsersPage(1);
  }, [userFilter, searchParams]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    currentUsersPage,
    setCurrentUsersPage,
    usersTotalPages,
    loadingUsers,
    userFilter,
    setUserFilter,
    fetchUsers,
  };
}
