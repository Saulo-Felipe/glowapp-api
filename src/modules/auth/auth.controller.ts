import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../../zod-validation.pipe';
import { AuthService } from './auth.service';
import { SendOtpCodeSchema, type SendOtpCodeDTO } from './schemas/send-otpcode';
import { SignInSchema, type SignInDto } from './schemas/sign-in.schema';
import { SignUpSchema, type SignUpDTO } from './schemas/sign-up.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @UsePipes(new ZodValidationPipe(SignInSchema))
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('sign-up')
  @UsePipes(new ZodValidationPipe(SignUpSchema))
  async signUp(@Body() body: SignUpDTO) {
    return await this.authService.signUp(body);
  }

  @Post('sign-up/send-otp')
  @UsePipes(new ZodValidationPipe(SendOtpCodeSchema))
  async sendOtpCode(@Body() body: SendOtpCodeDTO) {
    return await this.authService.sendOtpCode(body);
  }
}
