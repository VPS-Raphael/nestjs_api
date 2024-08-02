import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ProviderService } from '../provider/provider.service';

dotenv.config();

@Injectable()
export class ProductsService {
  constructor(private readonly providerService: ProviderService) {}

  async getAllProviders() {
    const providers = await this.providerService.getAllProviders();
  }

  async getProvider(name: string) {
    return this.providerService.findProviderByName(name);
  }
}
