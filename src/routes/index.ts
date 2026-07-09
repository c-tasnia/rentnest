import { Router } from "express";
import authRoutes from "./auth.routes";
import propertyRoutes from "./property.routes";
import landlordRoutes from "./landlord.routes";
import rentalRoutes from "../../../routes/rental.routes";
import paymentRoutes from "./payment.routes";
import reviewRoutes from "../../../routes/review.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/", propertyRoutes); // /properties, /categories (public)
router.use("/landlord", landlordRoutes);
router.use("/rentals", rentalRoutes);
router.use("/payments", paymentRoutes);
router.use("/reviews", reviewRoutes);
router.use("/admin", adminRoutes);

export default router;
