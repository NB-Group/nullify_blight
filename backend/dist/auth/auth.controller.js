"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const throttler_1 = require("@nestjs/throttler");
const access_token_guard_1 = require("../common/guards/access-token/access-token.guard");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
let AuthController = class AuthController {
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    signup(dto) {
        return this.authService.signup(dto);
    }
    signin(dto) {
        return this.authService.signin(dto);
    }
    verifyEmail(token) {
        return this.authService.verifyEmail(token);
    }
    githubAuth() {
    }
    getGithubConfig() {
        return {
            clientId: this.configService.get('GITHUB_CLIENT_ID'),
            callbackUrl: this.configService.get('GITHUB_CALLBACK_URL'),
            hasClientSecret: !!this.configService.get('GITHUB_CLIENT_SECRET'),
        };
    }
    async githubAuthCallback(req, res) {
        try {
            if (!req.user) {
                console.error('GitHub OAuth callback: No user data received');
                return res.redirect('http://127.0.0.1:3000/auth?error=oauth_failed');
            }
            const result = await this.authService.signInWithGithub(req.user);
            const frontendUrl = process.env.FRONTEND_URL ?? 'http://127.0.0.1:3000';
            if ('needsProfile' in result && result.needsProfile) {
                const redirectUrl = `${frontendUrl}/auth/complete-profile?token=${encodeURIComponent(result.access_token)}`;
                return res.redirect(302, redirectUrl);
            }
            const redirectUrl = `${frontendUrl}/auth/callback?token=${encodeURIComponent(result.access_token)}`;
            return res.redirect(302, redirectUrl);
        }
        catch (error) {
            console.error('GitHub OAuth callback error:', error);
            return res.redirect('http://127.0.0.1:3000/auth?error=oauth_failed');
        }
    }
    getProfile(req) {
        return req.user;
    }
    async updateProfile(req, body) {
        const userId = req.user['sub'];
        const updatedUser = await this.authService.updateUserProfile(userId, body.name);
        return { message: 'Profile updated successfully', user: updatedUser };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, throttler_1.Throttle)({
        default: {
            limit: 5,
            ttl: 60000,
        },
    }),
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, throttler_1.Throttle)({
        default: {
            limit: 5,
            ttl: 60000,
        },
    }),
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.Get)('verify-email'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Get)('github'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('github')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "githubAuth", null);
__decorate([
    (0, common_1.Get)('github/config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getGithubConfig", null);
__decorate([
    (0, common_1.Get)('github/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('github')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubAuthCallback", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map