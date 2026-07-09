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
const express_1 = require("express");
const landlordController = __importStar(require("../controllers/landlord.controller"));
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const property_validation_1 = require("../validations/property.validation");
const rental_validation_1 = require("../validations/rental.validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, (0, auth_1.authorize)("LANDLORD"));
router.get("/properties", landlordController.getMyProperties);
router.post("/properties", (0, validate_1.validate)(property_validation_1.createPropertySchema), landlordController.createProperty);
router.put("/properties/:id", (0, validate_1.validate)(property_validation_1.updatePropertySchema), landlordController.updateProperty);
router.delete("/properties/:id", landlordController.deleteProperty);
router.get("/requests", landlordController.getRequestsForMyProperties);
router.patch("/requests/:id", (0, validate_1.validate)(rental_validation_1.updateRentalStatusSchema), landlordController.updateRequestStatus);
exports.default = router;
//# sourceMappingURL=landlord.routes.js.map