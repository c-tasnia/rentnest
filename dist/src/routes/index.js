"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const property_routes_1 = __importDefault(require("./property.routes"));
const landlord_routes_1 = __importDefault(require("./landlord.routes"));
const rental_routes_1 = __importDefault(require("./rental.routes"));
const payment_routes_1 = __importDefault(require("./payment.routes"));
const review_routes_1 = __importDefault(require("./review.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/", property_routes_1.default); // /properties, /categories (public)
router.use("/landlord", landlord_routes_1.default);
router.use("/rentals", rental_routes_1.default);
router.use("/payments", payment_routes_1.default);
router.use("/reviews", review_routes_1.default);
router.use("/admin", admin_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map