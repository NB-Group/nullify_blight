import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    hashData(data: string): any;
    getToken(userId: number, email: string): Promise<{
        access_token: string;
    }>;
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
}
