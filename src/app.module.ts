import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SigninModule } from './modules/auth/sign-in/sign-in.module';

@Module({
  imports: [SigninModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
