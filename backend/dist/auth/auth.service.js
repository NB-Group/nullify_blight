"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const library_1 = require("@prisma/client/runtime/library");
const mail_service_1 = require("../mail/mail.service");
const crypto = __importStar(require("crypto"));
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let AuthService = class AuthService {
    constructor(prisma, jwtService, mailService, httpService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.httpService = httpService;
    }
    hashData(data) {
        return bcrypt.hash(data, 10);
    }
    async getToken(userId, email, name) {
        const payload = {
            sub: userId,
            email,
            name: name || undefined,
        };
        const at = await this.jwtService.signAsync(payload);
        return {
            access_token: at,
        };
    }
    async signup(dto) {
        const captchaVerified = await this.verifyCaptcha(dto.captchaToken);
        if (!captchaVerified) {
            throw new common_1.ForbiddenException('CAPTCHA verification failed.');
        }
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
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new common_1.ForbiddenException('An account with this email already exists.');
            }
            throw error;
        }
    }
    async verifyCaptcha(token) {
        const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, {
                secret: process.env.TURNSTILE_SECRET_KEY,
                response: token,
            }));
            return response.data.success;
        }
        catch (error) {
            console.error('CAPTCHA verification request failed:', error);
            return false;
        }
    }
    async verifyEmail(token) {
        const user = await this.prisma.user.findUnique({
            where: { verificationToken: token },
        });
        if (!user) {
            throw new common_1.ForbiddenException('Invalid verification token.');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
            },
        });
        return { message: 'Email verified successfully.' };
    }
    async signInWithGithub(user) {
        if (!user || !user.email) {
            throw new common_1.ForbiddenException('Could not retrieve email from GitHub.');
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
            const updatedUser = await this.prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    githubId: user.githubId,
                    lastLogin: new Date(),
                },
            });
            return this.getToken(updatedUser.id, updatedUser.email, updatedUser.name);
        }
        const newUser = await this.prisma.user.create({
            data: {
                email: user.email,
                githubId: user.githubId,
                name: user.name || null,
                isVerified: true,
                lastLogin: new Date(),
            },
        });
        const token = await this.getToken(newUser.id, newUser.email, newUser.name);
        if (!user.name) {
            return { ...token, needsProfile: true };
        }
        return token;
    }
    async signin(dto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isVerified) {
            throw new common_1.ForbiddenException('Please verify your email before logging in.');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        return this.getToken(user.id, user.email, user.name);
    }
    async updateUserProfile(userId, name) {
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { name },
            select: { id: true, email: true, name: true },
        });
        return updatedUser;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        axios_1.HttpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map