import { HashAdapter } from "@domain/adapters/hash";
import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";

@Injectable()
export class HashIntegration implements HashAdapter {
  private HASH_SALTS = 10;

  compare(plainText: string, encryptText: string): Promise<boolean> {
    return compare(plainText, encryptText);
  }

  generateHash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALTS);
  }
}
