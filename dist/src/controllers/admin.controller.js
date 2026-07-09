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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.createCategory = exports.getAllRentalRequests = exports.getAllProperties = exports.updateUserStatus = exports.getAllUsers = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const adminService = __importStar(require("../services/admin.service"));
exports.getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const users = await adminService.listAllUsers();
    (0, ApiResponse_1.sendSuccess)(res, 200, "Users fetched", users);
});
exports.updateUserStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status } = req.body;
    if (!["ACTIVE", "BANNED"].includes(status)) {
        throw ApiError_1.ApiError.badRequest("status must be ACTIVE or BANNED");
    }
    const user = await adminService.updateUserStatus(req.params.id, status);
    (0, ApiResponse_1.sendSuccess)(res, 200, "User status updated", user);
});
exports.getAllProperties = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const properties = await adminService.listAllProperties();
    (0, ApiResponse_1.sendSuccess)(res, 200, "Properties fetched", properties);
});
exports.getAllRentalRequests = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const requests = await adminService.listAllRentalRequests();
    (0, ApiResponse_1.sendSuccess)(res, 200, "Rental requests fetched", requests);
});
exports.createCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, description } = req.body;
    if (!name)
        throw ApiError_1.ApiError.badRequest("Category name is required");
    const category = await adminService.createCategory(name, description);
    (0, ApiResponse_1.sendSuccess)(res, 201, "Category created", category);
});
exports.deleteCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await adminService.deleteCategory(req.params.id);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Category deleted");
});
//# sourceMappingURL=admin.controller.js.map