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
exports.updateRequestStatus = exports.getRequestsForMyProperties = exports.getMyProperties = exports.deleteProperty = exports.updateProperty = exports.createProperty = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const propertyService = __importStar(require("../services/property.service"));
const rentalService = __importStar(require("../services/rental.service"));
exports.createProperty = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    const property = await propertyService.createProperty(req.user.id, req.body);
    (0, ApiResponse_1.sendSuccess)(res, 201, "Property created", property);
});
exports.updateProperty = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    const property = await propertyService.updateProperty(req.params.id, req.user.id, req.body);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Property updated", property);
});
exports.deleteProperty = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    await propertyService.deleteProperty(req.params.id, req.user.id);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Property deleted");
});
exports.getMyProperties = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    const properties = await propertyService.listLandlordProperties(req.user.id);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Landlord properties fetched", properties);
});
exports.getRequestsForMyProperties = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    const requests = await rentalService.listRequestsForLandlord(req.user.id);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Rental requests fetched", requests);
});
exports.updateRequestStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    const request = await rentalService.updateRentalStatus(req.params.id, req.user.id, req.body.status);
    (0, ApiResponse_1.sendSuccess)(res, 200, `Rental request ${req.body.status.toLowerCase()}`, request);
});
//# sourceMappingURL=landlord.controller.js.map