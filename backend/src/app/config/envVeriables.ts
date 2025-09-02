import dotenv from 'dotenv';
dotenv.config();

interface EnvVariables {
  PORT: string;
  MONGO_URI: string;
  NODE_ENV: "development" | "production" | "test";
  JWT_ACCESS_SECRET?: string;
  JWT_ACCESS_EXPIRES?: string;
  JWT_REFRESH_SECRET?: string;
  JWT_REFRESH_EXPIRES?: string;
  EXPRESS_SESSION_SECRET?: string; // Added for express-session configuration
  GOOGLE?: {
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GOOGLE_CALLBACK_URL?: string;
  };
  FRONTEND_URL?: string; // Added for frontend URL configuration
  BCRYPT_SALT_ROUNDS?: string; // Added for bcrypt salt rounds
  ADMIN?: {
    ADMIN_EMAIL?: string;
    ADMIN_PASSWORD?: string;
  };
  SSL: {
    SSL_STORE_ID?: string;
    SSL_STORE_PASSWORD?: string;
    SSL_VALIDATION_API_URL?: string;
    SSL_PAYMENT_API_URL?: string;
    SSL_IPN_URL?: string;
    SSL_SUCCESS_BACKEND_URL?: string;
    SSL_FAIL_BACKEND_URL?: string;
    SSL_CANCEL_BACKEND_URL?: string;
    SSL_SUCCESS_FRONTEND_URL?: string;
    SSL_FAIL_FRONTEND_URL?: string;
    SSL_CANCEL_FRONTEND_URL?: string;
  },
  EMAIL_SENDER:{
    SMTP_HOST?: string;
    SMTP_PORT?: number;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    SMTP_FROM?: string;
  },
  REDIS: {
    REDIS_HOST?: string;
    REDIS_PORT?: string;
    REDIS_PASSWORD?: string;
    REDIS_USERNAME?: string;
  }
}

const loadEnvVariables = (): EnvVariables => {
  const requiredEnvVariables = ["PORT", "MONGO_URI", "BCRYPT_SALT_ROUNDS", "NODE_ENV", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", "EXPRESS_SESSION_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALLBACK_URL", "FRONTEND_URL", "ADMIN_EMAIL", "ADMIN_PASSWORD", "SSL_SUCCESS_BACKEND_URL",
    "SSL_FAIL_BACKEND_URL",
    "SSL_CANCEL_BACKEND_URL", "SSL_STORE_ID",
    "SSL_STORE_PASSWORD",
    "SSL_VALIDATION_API_URL",
    "SSL_PAYMENT_API_URL",
    "SSL_IPN_URL", "SSL_SUCCESS_FRONTEND_URL",
    "SSL_FAIL_FRONTEND_URL", 
    "SSL_CANCEL_FRONTEND_URL",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
    "REDIS_HOST",
    "REDIS_PORT",
    "REDIS_PASSWORD",
    "REDIS_USERNAME"
  ];
  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Missing environment variable: ${variable}`);
    }
  });
  return {
    PORT: process.env.PORT!,
    MONGO_URI: process.env.MONGO_URI!,
    NODE_ENV: process.env.NODE_ENV! as "development" | "production" | "test",
    //  jwt config
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
    GOOGLE: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL
    },
    FRONTEND_URL: process.env.FRONTEND_URL,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
    ADMIN: {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
    },
    SSL: {
      SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL,
      SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL,
      SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL,
      SSL_STORE_ID: process.env.SSL_STORE_ID,
      SSL_STORE_PASSWORD: process.env.SSL_STORE_PASSWORD,
      SSL_VALIDATION_API_URL: process.env.SSL_VALIDATION_API_URL,
      SSL_PAYMENT_API_URL: process.env.SSL_PAYMENT_API_URL,
      SSL_IPN_URL: process.env.SSL_IPN_URL,
      SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL,
      SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL,
      SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL,
    },
    EMAIL_SENDER:{
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      SMTP_FROM: process.env.SMTP_FROM,
    },
    REDIS: {
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      REDIS_USERNAME: process.env.REDIS_USERNAME,
    }
  };
};

export const envVariables = loadEnvVariables();
