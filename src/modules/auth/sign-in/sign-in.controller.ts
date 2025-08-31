import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../../../zod-validation.pipe';
import { SignInSchema, type SignInDto } from './sign-in.schema';
import { SignInService } from './sign-in.service';

@Controller('auth/sign-in')
export class SignInController {
  constructor(private readonly signInService: SignInService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(SignInSchema))
  signIn(@Body() body: SignInDto): SignInDto {
    return this.signInService.signIn(body);
  }
}
