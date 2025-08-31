import { Injectable } from '@nestjs/common';
import { SignInDto } from './sign-in.schema';

@Injectable()
export class SignInService {
  signIn(body: SignInDto): SignInDto {
    return body;
  }
}
