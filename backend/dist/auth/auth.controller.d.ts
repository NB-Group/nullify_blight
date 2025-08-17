import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    signup(dto: AuthDto): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
        };
    }>;
    signin(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    githubAuth(): void;
    getGithubConfig(): {
        clientId: any;
        callbackUrl: any;
        hasClientSecret: boolean;
    };
    githubAuthCallback(req: Request, res: Response): Promise<void>;
    getProfile(req: Request): {
        sub: number;
        email: string;
    };
    updateProfile(req: Request, body: {
        name: string;
    }): Promise<{
        message: string;
        user: {
            email: string;
            name: string;
            id: number;
        };
    }>;
}
