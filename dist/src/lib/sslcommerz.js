"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateSslcommerzPayment = initiateSslcommerzPayment;
exports.validateSslcommerzPayment = validateSslcommerzPayment;
const SSLCommerzPayment = require("sslcommerz-lts");
const config_1 = require("../config");
const store_id = config_1.config.sslcz.storeId;
const store_passwd = config_1.config.sslcz.storePassword;
const is_live = config_1.config.sslcz.isLive;
// Kicks off an SSLCommerz session and returns the GatewayPageURL the client
// should redirect the tenant to for hosted checkout.
async function initiateSslcommerzPayment(input) {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const data = {
        total_amount: input.amount,
        currency: "BDT",
        tran_id: input.transactionId,
        success_url: `${config_1.config.backendUrl}/api/payments/confirm?status=success`,
        fail_url: `${config_1.config.backendUrl}/api/payments/confirm?status=fail`,
        cancel_url: `${config_1.config.backendUrl}/api/payments/confirm?status=cancel`,
        ipn_url: `${config_1.config.backendUrl}/api/payments/confirm`,
        shipping_method: "NO",
        product_name: input.propertyTitle,
        product_category: "Rental",
        product_profile: "general",
        cus_name: input.tenantName,
        cus_email: input.tenantEmail,
        cus_add1: "N/A",
        cus_city: "N/A",
        cus_postcode: "0000",
        cus_country: "Bangladesh",
        cus_phone: input.tenantPhone || "N/A",
        ship_name: input.tenantName,
        ship_add1: "N/A",
        ship_city: "N/A",
        ship_postcode: "0000",
        ship_country: "Bangladesh",
    };
    const response = await sslcz.init(data);
    return response;
}
async function validateSslcommerzPayment(val_id) {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    return sslcz.validate({ val_id });
}
//# sourceMappingURL=sslcommerz.js.map