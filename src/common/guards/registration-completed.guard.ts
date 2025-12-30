import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegistrationStep } from '../../users/user.schema';

@Injectable()
export class RegistrationCompletedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.step !== RegistrationStep.COMPLETED) {
      throw new ForbiddenException('Registrazione non completata');
    }

    return true;
  }
}
