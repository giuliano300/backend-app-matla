/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // <-- payload JWT

    return data ? user?.[data] : user;
  },
);
