"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const prisma_1 = require("./lib/prisma");
async function main() {
    await prisma_1.prisma.$connect();
    app_1.default.listen(config_1.config.port, () => {
        console.log(`RentNest API running on port ${config_1.config.port} [${config_1.config.nodeEnv}]`);
    });
}
main().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map