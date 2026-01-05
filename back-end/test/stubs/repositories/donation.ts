import { PaginatedEntity } from "@domain/constants/pagination";
import { Donation } from "@domain/entities/donation";
import {
  DonationDetailsResponse,
  DonationDetailsResponseWithPayment,
  DonationRepository
} from "@domain/repositories/donation";

export class DonationRepositoryStub implements DonationRepository {
  async findById(): Promise<Donation | null> {
    return null;
  }
  async findAllByDonor(): Promise<PaginatedEntity<DonationDetailsResponse>> {
    return {
      data: [],
      page: 1,
      lastPage: 1,
      total: 0
    };
  }

  async findAllByCampaign(): Promise<DonationDetailsResponseWithPayment[]> {
    return [];
  }

  async create(): Promise<Donation> {
    return;
  }
  async update(): Promise<void> {
    return;
  }
  async delete(): Promise<void> {
    return;
  }
}
