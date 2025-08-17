import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MailService } from 'src/mail/mail.service';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private httpService: HttpService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getToken(userId: number, email: string, name?: string) {
    const payload = {
      sub: userId,
      email,
      name: name || undefined,
    };

    // Use JwtModule-configured secret and options to keep signing and validation consistent
    const at = await this.jwtService.signAsync(payload);

    return {
      access_token: at,
    };
  }

  async signup(dto: AuthDto) {
    // 1. Verify the CAPTCHA token
    const captchaVerified = await this.verifyCaptcha(dto.captchaToken);
    if (!captchaVerified) {
      throw new ForbiddenException('CAPTCHA verification failed.');
    }

    // 2. Proceed with user creation
    const hash = await this.hashData(dto.password);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          name: dto.name ?? null,
          verificationToken: verificationToken,
        },
      });

      await this.mailService.sendVerificationEmail(newUser.email, verificationToken);

      return {
        message: 'Signup successful. Please check your email to verify your account.',
        user: { id: newUser.id, email: newUser.email },
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('An account with this email already exists.');
      }
      throw error;
    }
  }

  private async verifyCaptcha(token: string): Promise<boolean> {
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, {
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        })
      );
      return response.data.success;
    } catch (error) {
      console.error('CAPTCHA verification request failed:', error);
      return false;
    }
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new ForbiddenException('Invalid verification token.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null, // Clear the token after verification
      },
    });

    return { message: 'Email verified successfully.' };
  }

  async signInWithGithub(user: any) {
    if (!user || !user.email) {
      throw new ForbiddenException('Could not retrieve email from GitHub.');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: user.email },
          { githubId: user.githubId },
        ],
      },
    });

    if (existingUser) {
      // If user exists, update their githubId if it's not already set
      const updatedUser = await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          githubId: user.githubId,
          lastLogin: new Date(),
        },
      });
      return this.getToken(updatedUser.id, updatedUser.email, updatedUser.name);
    }

    // If user does not exist, create a new one
    const newUser = await this.prisma.user.create({
      data: {
        email: user.email,
        githubId: user.githubId,
        name: user.name || null, // GitHub username might be empty
        isVerified: true, // OAuth users are considered verified
        lastLogin: new Date(),
      },
    });

    // If no name provided from GitHub, redirect to profile completion
    const token = await this.getToken(newUser.id, newUser.email, newUser.name);
    if (!user.name) {
      return { ...token, needsProfile: true };
    }

    return token;
  }


  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Please verify your email before logging in.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    
    return this.getToken(user.id, user.email, user.name);
  }

  async updateUserProfile(userId: number, name: string) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, email: true, name: true },
    });
    return updatedUser;
  }
}
