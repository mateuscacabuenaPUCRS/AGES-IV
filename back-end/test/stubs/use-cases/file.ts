import {
  CreateFileDTO,
  CreateFileResponse
} from "@application/dtos/file/create";
import { jest } from "@jest/globals";

export class FileUseCaseStub {
  execute = jest.fn<(file: CreateFileDTO) => Promise<CreateFileResponse>>();
}
