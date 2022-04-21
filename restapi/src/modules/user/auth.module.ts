import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/controllers/auth/auth.controller';

import { LocalStrategy } from 'src/services/auth/local.strategy';
import { UserModule } from './user.module';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtStrategy } from 'src/services/auth/jwt.strategy';
import { RolesGuard } from 'src/middlewares/guards/auth/role.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: `${configService.get('JWT_ACCESS_EXPIRED')}`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
