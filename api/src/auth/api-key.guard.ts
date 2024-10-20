import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class APIKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-api-key'];

    if (!token) {
      throw new UnauthorizedException('Auth token not provided.');
    }

    try {
      const api_key = process.env.FRONTEND_API_KEY;

      if (token !== api_key) {
        throw new UnauthorizedException('Invalid API KEY');
      }

      request['logged_in_user'] = null;

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
