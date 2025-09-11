import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DefaultControllerResponse } from 'src/@types/default-controller-response';
import { PrismaService } from 'src/prisma.service';
import { SignInDto } from './schemas/sign-in.schema';
import { SignUpDTO } from './schemas/sign-up.schema';
import { VerifyOtpCodeDTO } from './schemas/verify-otpcode';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signIn(body: SignInDto): Promise<DefaultControllerResponse> {
    try {
      const company = await this.prisma.company.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!company || company.password !== body.password) {
        throw new UnauthorizedException({
          warning: true,
          message: 'Credenciais inválidas',
        });
      }

      return { success: true, message: 'Login realizado com sucesso' };
    } catch {
      return {
        error: true,
        message: 'Ocorreu um erro desconhecido ao fazer login',
      };
    }
  }

  async signUp(body: SignUpDTO): Promise<DefaultControllerResponse> {
    try {
      const company = await this.prisma.company.findUnique({
        where: {
          email: body.email,
        },
      });

      // Email Verification
      if (company) {
        return {
          warning: true,
          message: 'Já existe um usuário com esse email',
        };
      }

      if (body.password !== body.confirmPassword) {
        return {
          warning: true,
          message: 'As senhas não coincidem',
        };
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000);

      console.log('[OTP CODE]: ', otpCode);

      // try to send email

      // if sended email successfully
      await this.prisma.emailOTPSession.create({
        data: {
          email: body.email,
          otp: String(otpCode),
        },
      });

      return {
        success: true,
      };
    } catch {
      return {
        error: true,
        message: 'Ocorreu um erro desconhecido ao criar empresa',
      };
    }
  }

  async verifyOtp(body: VerifyOtpCodeDTO): Promise<DefaultControllerResponse> {
    try {
      const response = await this.prisma.emailOTPSession.findFirst({
        where: {
          email: body.email,
          otp: body.otp,
        },
      });

      if (response) {
        if (response.email === body.email && response.otp === body.otp) {
          return {
            success: true,
            message: 'Código de verificação verificado com sucesso',
          };
        }
      }

      return {
        warning: true,
        message: 'Código de verificação inválido',
      };
    } catch {
      return {
        error: true,
        message:
          'Ocorreu um erro desconhecido ao verificar o código de verificação',
      };
    }
  }
}
