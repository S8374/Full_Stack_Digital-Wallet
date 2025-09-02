// src/modules/sslCommerz/sslcommerz.service.ts
import axios from "axios";
import httpStatus from "http-status";
import { ISSLCommerz } from "./sslCommerz.interface";
import AppError from "../../errorHelpers/appError";
import { envVariables } from "../../config/envVeriables";
import { PAYMENT_TYPE } from "../payment/paymnet.interface";

// src/modules/sslCommerz/sslcommerz.service.ts
const sslPaymentInit = async (payload: ISSLCommerz, paymentRequestId: string) => {
  try {
    // Determine product name based on payment type
    let productName = "Digital Wallet Service";
    if (payload.type === PAYMENT_TYPE.ADD_MONEY) {
      productName = "Add Money to Wallet";
    } else if (payload.type === PAYMENT_TYPE.WITHDRAW) {
      productName = "Withdraw Money from Wallet";
    }

    const data = {
      store_id: envVariables.SSL.SSL_STORE_ID,
      store_passwd: envVariables.SSL.SSL_STORE_PASSWORD,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      // Include paymentRequestId in all callback URLs
      success_url: `${envVariables.SSL.SSL_SUCCESS_BACKEND_URL}?paymentRequestId=${paymentRequestId}&tran_id=${payload.transactionId}&amount=${payload.amount}`,
      fail_url: `${envVariables.SSL.SSL_FAIL_BACKEND_URL}?paymentRequestId=${paymentRequestId}&tran_id=${payload.transactionId}&amount=${payload.amount}`,
      cancel_url: `${envVariables.SSL.SSL_CANCEL_BACKEND_URL}?paymentRequestId=${paymentRequestId}&tran_id=${payload.transactionId}&amount=${payload.amount}`,
      ipn_url: envVariables.SSL.SSL_IPN_URL,
      shipping_method: "N/A",
      product_name: productName,
      product_category: "Financial Service",
      product_profile: "general",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: payload.phoneNumber,
      cus_fax: "01711111111",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "N/A",
    };

    const response = await axios({
      method: "POST",
      url: envVariables.SSL.SSL_PAYMENT_API_URL,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    return response.data;
  } catch (error: any) {
    console.log("Payment Error Occurred", error);
    throw new AppError(httpStatus.BAD_REQUEST, error.message || "Payment initialization failed");
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${envVariables.SSL.SSL_VALIDATION_API_URL}?val_id=${payload.val_id}&store_id=${envVariables.SSL.SSL_STORE_ID}&store_passwd=${envVariables.SSL.SSL_STORE_PASSWORD}&format=json`
    });

    console.log("sslcommerz validate api response", response.data);
    
    if (response.data.status !== 'VALID') {
      throw new AppError(httpStatus.BAD_REQUEST, "Payment validation failed");
    }
    
    return response.data;
  } catch (error: any) {
    console.log("SSL Validation Error:", error);
    throw new AppError(httpStatus.BAD_REQUEST, `Payment Validation Error: ${error.message}`);
  }
};

export const SSLService = {
  sslPaymentInit,
  validatePayment
};