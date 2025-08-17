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
exports.PaperController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const access_token_guard_1 = require("../common/guards/access-token/access-token.guard");
const create_paper_dto_1 = require("./dto/create-paper.dto");
const paper_service_1 = require("./paper.service");
let PaperController = class PaperController {
    constructor(paperService) {
        this.paperService = paperService;
    }
    create(file, createPaperDto, req) {
        const userId = req.user['sub'];
        return this.paperService.create(userId, createPaperDto, file.path);
    }
    findOne(id) {
        return this.paperService.findOne(id);
    }
    findAll(page, pageSize) {
        return this.paperService.findAll(page, pageSize);
    }
    getReportPackage(id) {
        return this.paperService.getReportPackage(id);
    }
};
exports.PaperController = PaperController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { dest: './uploads' })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_paper_dto_1.CreatePaperDto, Object]),
    __metadata("design:returntype", void 0)
], PaperController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PaperController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('pageSize', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], PaperController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/report-package'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PaperController.prototype, "getReportPackage", null);
exports.PaperController = PaperController = __decorate([
    (0, common_1.Controller)('paper'),
    __metadata("design:paramtypes", [paper_service_1.PaperService])
], PaperController);
//# sourceMappingURL=paper.controller.js.map