import { Injectable, UnauthorizedException } from '@nestjs/common';
import argon2 from 'argon2';
import { DefaultControllerResponse } from 'src/@types/default-controller-response';
import { PrismaService } from 'src/prisma.service';
import { SendOtpCodeDTO } from './schemas/send-otpcode';
import { SignInDto } from './schemas/sign-in.schema';
import { SignUpDTO } from './schemas/sign-up.schema';

const OTP_EXPIRATION_TIME = 1000 * 60 * 1; // 1 minute

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
      const verifyOTPFeedback = await this.verifyOtp({
        email: body.email,
        otp: body.otp,
      });

      if (verifyOTPFeedback.success) {
        // frontend já faz essa verificação
        if (body.password !== body.confirmPassword) {
          return {
            warning: true,
            message: 'As senhas não coincidem',
          };
        }

        const hashedPassword = await argon2.hash(body.password);

        await this.prisma.company.create({
          data: {
            email: body.email,
            password: hashedPassword,
            registrationStep: 1,
          },
        });

        return {
          success: true,
          message: 'Usuário cadastrado com sucesso!',
        };
      }

      return verifyOTPFeedback;
    } catch {
      return {
        error: true,
        message: 'Ocorreu um erro desconhecido ao cadastrar usuário.',
      };
    }
  }

  async verifyOtp(params: {
    email: string;
    otp: string;
  }): Promise<DefaultControllerResponse> {
    try {
      const response = await this.prisma.emailOTPSession.findFirst({
        where: {
          email: params.email,
          otp: params.otp,
        },
      });

      if (response) {
        if (
          Date.now() >
          new Date(response.updatedAt).getTime() + OTP_EXPIRATION_TIME
        ) {
          await this.prisma.emailOTPSession.delete({
            where: { id: response.id },
          });

          return {
            warning: true,
            message: 'Código de verificação expirado',
          };
        }

        if (response.otp === params.otp) {
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

  async sendOtpCode(body: SendOtpCodeDTO): Promise<DefaultControllerResponse> {
    try {
      const haveUser = await this.prisma.company.count({
        where: { email: body.email },
      });

      if (haveUser) {
        return {
          warning: true,
          message: 'Já existe um usuário com esse e-mail',
        };
      }

      const response = await this.prisma.emailOTPSession.findFirst({
        where: {
          email: body.email,
        },
      });

      const otpCode = Math.floor(100000 + Math.random() * 900000);

      if (response) {
        if (
          Date.now() <
          new Date(response.updatedAt).getTime() + OTP_EXPIRATION_TIME
        ) {
          return {
            warning: true,
            message: 'Aguarde um momento para reenviar o código de verificação',
          };
        }

        //=======================================================
        // send email with otp code
        //=======================================================
        console.log('===[EMAIL]===\n', otpCode);

        await this.prisma.emailOTPSession.update({
          where: { id: response.id },
          data: { otp: String(otpCode) },
        });
      } else {
        //=======================================================
        // send email with otp code
        //=======================================================
        console.log('===[EMAIL]===\n', otpCode);

        await this.prisma.emailOTPSession.create({
          data: {
            email: body.email,
            otp: String(otpCode),
          },
        });
      }

      return {
        success: true,
        message: 'Código de verificação enviado com sucesso',
      };
    } catch {
      return {
        error: true,
        message:
          'Ocorreu um erro desconhecido ao reenviar o código de verificação',
      };
    }
  }
}
