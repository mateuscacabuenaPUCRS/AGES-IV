import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getDonorById, getDonorDonations, type DonorItem } from "@/services/donors";
import type { DonorDonationsAPI } from "@/services/donations";
import type { CampaignDonation } from "../types";
import { transformDonations, extractUniqueCampaigns } from "../utils/profileTransformers";

export function useDonorProfile(
  donorId: string | undefined,
  currentUserId: string | undefined,
  campaignsPageSize: number,
  currentCampaignsPage: number,
  currentDonationsPage: number
) {
  const navigate = useNavigate();
  const [viewingDonorProfile, setViewingDonorProfile] = useState<DonorItem | null>(null);
  const [isLoadingDonorProfile, setIsLoadingDonorProfile] = useState(false);
  const [viewingDonorCampaigns, setViewingDonorCampaigns] = useState<CampaignDonation[]>([]);
  const [viewingDonorDonations, setViewingDonorDonations] = useState<DonorDonationsAPI[]>([]);
  const [viewingDonorCampaignsTotalPages, setViewingDonorCampaignsTotalPages] = useState(1);
  const [viewingDonorDonationsTotalPages, setViewingDonorDonationsTotalPages] = useState(1);

  const [allViewingDonorCampaigns, setAllViewingDonorCampaigns] = useState<CampaignDonation[]>([]);
  const [allViewingDonorDonations, setAllViewingDonorDonations] = useState<DonorDonationsAPI[]>([]);

  const isViewingAnotherProfile = !!donorId && donorId !== currentUserId;

  // Fetch donor profile data
  const fetchDonorProfile = useCallback(
    async (id: string) => {
      try {
        setIsLoadingDonorProfile(true);

        const donorData = await getDonorById(id);
        setViewingDonorProfile(donorData);

        const donationsData = await getDonorDonations(id, 1, 1000);

        const transformedDonations = transformDonations(donationsData);
        setAllViewingDonorDonations(transformedDonations);

        const uniqueCampaigns = extractUniqueCampaigns(donationsData);
        setAllViewingDonorCampaigns(uniqueCampaigns);

        setViewingDonorCampaignsTotalPages(
          Math.ceil(uniqueCampaigns.length / campaignsPageSize) || 1
        );
        setViewingDonorDonationsTotalPages(Math.ceil(transformedDonations.length / 10) || 1);
      } catch (error) {
        console.error("Error fetching donor profile:", error);
        toast.error("Erro ao carregar perfil do doador");
        navigate("/perfil");
      } finally {
        setIsLoadingDonorProfile(false);
      }
    },
    [campaignsPageSize, navigate]
  );

  // Fetch profile when donorId changes
  useEffect(() => {
    if (donorId && donorId !== currentUserId) {
      fetchDonorProfile(donorId);
    } else {
      setViewingDonorProfile(null);
      setAllViewingDonorCampaigns([]);
      setAllViewingDonorDonations([]);
    }
  }, [donorId, currentUserId, fetchDonorProfile]);

  // Client-side pagination for campaigns
  useEffect(() => {
    if (isViewingAnotherProfile && allViewingDonorCampaigns.length > 0) {
      const startIndex = (currentCampaignsPage - 1) * campaignsPageSize;
      const endIndex = startIndex + campaignsPageSize;
      const paginatedCampaigns = allViewingDonorCampaigns.slice(startIndex, endIndex);
      setViewingDonorCampaigns(paginatedCampaigns);
    }
  }, [currentCampaignsPage, campaignsPageSize, allViewingDonorCampaigns, isViewingAnotherProfile]);

  // Client-side pagination for donations
  useEffect(() => {
    if (isViewingAnotherProfile && allViewingDonorDonations.length > 0) {
      const startIndex = (currentDonationsPage - 1) * 10;
      const endIndex = startIndex + 10;
      const paginatedDonations = allViewingDonorDonations.slice(startIndex, endIndex);
      setViewingDonorDonations(paginatedDonations);
    }
  }, [currentDonationsPage, allViewingDonorDonations, isViewingAnotherProfile]);

  return {
    viewingDonorProfile,
    isLoadingDonorProfile,
    viewingDonorCampaigns,
    viewingDonorDonations,
    viewingDonorCampaignsTotalPages,
    viewingDonorDonationsTotalPages,
    isViewingAnotherProfile,
  };
}
