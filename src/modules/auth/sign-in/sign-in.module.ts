import { Module } from '@nestjs/common';
import { SignInController } from './sign-in.controller';
import { SignInService } from './sign-in.service';

@Module({
  imports: [],
  controllers: [SignInController],
  providers: [SignInService],
})
export class SigninModule {}
