
const SSLCommerzPayment = require("sslcommerz-lts");
import { config } from "../config";

const store_id = config.sslcz.storeId;
const store_passwd = config.sslcz.storePassword;
const is_live = config.sslcz.isLive;

interface InitPaymentInput {
  transactionId: string;
  amount: number;
  tenantName: string;
  tenantEmail: string;
  tenantPhone?: string;
  propertyTitle: string;
}

// Kicks off an SSLCommerz session and returns the GatewayPageURL the client
// should redirect the tenant to for hosted checkout.
export async function initiateSslcommerzPayment(input: InitPaymentInput) {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const data = {
    total_amount: input.amount,
    currency: "BDT",
    tran_id: input.transactionId,
    success_url: `${config.backendUrl}/api/payments/confirm?status=success`,
    fail_url: `${config.backendUrl}/api/payments/confirm?status=fail`,
    cancel_url: `${config.backendUrl}/api/payments/confirm?status=cancel`,
    ipn_url: `${config.backendUrl}/api/payments/confirm`,
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
  return response as { GatewayPageURL?: string; status?: string };
}

export async function validateSslcommerzPayment(val_id: string) {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  return sslcz.validate({ val_id });
}
