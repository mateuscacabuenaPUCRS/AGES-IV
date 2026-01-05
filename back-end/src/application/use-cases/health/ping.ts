import { Injectable } from "@nestjs/common";

export interface PingResponse {
  message: string;
}

@Injectable()
export class PingUseCase {
  async execute(): Promise<PingResponse> {
    return { message: "pong" };
  }
}
