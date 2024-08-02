import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ProviderService } from './provider.service';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post('create')
  async create(@Body() body) {
    const providerData = body.providerData;

    if (!(await this.providerService.findProviderByName(providerData.name)))
      await this.providerService.createProvider(body.providerData);
  }

  @Get('all')
  async all(@Res() response) {
    try {
      const providers = await this.providerService.getAllProviders();
      response.status(200).json(providers);
    } catch (error) {
      console.error('An error occurred while fetching all providers:', error);
      response.status(500).json({ message: 'Internal server error' });
    }
  }
}
