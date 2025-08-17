import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import type { Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: AuthDto): Promise<{
        message: string;
        user: {
            email: string;
            password: string;
            name: string | null;
            lastLogin: Date;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    }>;
    signin(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    getProfile(req: Request): {
        sub: number;
        email: string;
    };
}
