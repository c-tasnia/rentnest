"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
require("dotenv/config");
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@rentnest.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 10);
    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            name: "RentNest Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "ADMIN",
        },
    });
    console.log(`Admin ready -> ${adminEmail} / ${adminPassword}`);
    const categories = ["Apartment", "House", "Studio", "Condo", "Villa"];
    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    console.log(`Seeded ${categories.length} categories`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map