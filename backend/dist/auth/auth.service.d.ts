import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { HttpService } from '@nestjs/axios';
export declare class AuthService {
    private prisma;
    private jwtService;
    private mailService;
    private httpService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService, httpService: HttpService);
    hashData(data: string): any;
    getToken(userId: number, email: string, name?: string): Promise<{
        access_token: string;
    }>;
    signup(dto: AuthDto): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
        };
    }>;
    private verifyCaptcha;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    signInWithGithub(user: any): Promise<{
        access_token: string;
    } | {
        needsProfile: boolean;
        access_token: string;
    }>;
    signin(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    updateUserProfile(userId: number, name: string): Promise<{
        email: string;
        name: string;
        id: number;
    }>;
}
