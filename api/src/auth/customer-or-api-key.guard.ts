import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CustomerGuard } from './customer.guard';
import { APIKeyGuard } from './api-key.guard';

@Injectable()
export class CustomerOrAPIKeyGuard implements CanActivate {
  constructor(
    private readonly customerGuard: CustomerGuard,
    private readonly apiKeyGuard: APIKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context.switchToHttp().getRequest();

    const api_key_provided = await request.headers['x-api-key'];

    if (api_key_provided) {
      return await this.apiKeyGuard.canActivate(context);
    } else {
      return await this.customerGuard.canActivate(context);
    }
  }
}
