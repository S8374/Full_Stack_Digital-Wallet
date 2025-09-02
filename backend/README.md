

## 🔐 Authentication
Backend Main LiveLink :

```bash
https://backend-theta-one-51.vercel.app
```
#### Authentication


```http
  POST /api/v1/auth/signup
```

| Parameter | Type     | Description                |Required|
| :-------- | :------- | :------------------------- |-----------|
| `name` | `string` |User's full name |✅|
| `email` | `string` | User's email address |✅|
| `password` | `string` | User's password (min 6 characters)	 |✅|
| `phone` | `string` | User's phone number|❌|
| `address` | `string` |	User's physical address|❌|
| `role` | `string` | User role (user/agent/admin)|❌|

#### Response:

```http
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "isVerified": "boolean"
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
}
```

Add Money to Wallet

```http
    POST /api/v1/auth/login
```

| Parameter | Type     | Description                |Required|
| :-------- | :------- | :------------------------- |-----------|
| `email` | `string` | User's email address |✅|
| `password` | `string` | User's password (min 6 characters)	 |✅|

### Response
```http
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
}
```


Refresh Access Token

```http
      POST /api/v1/auth/refresh-token
```
***Headers:***
```Cookie: refreshToken=your_refresh_token```

### Response
```http
{
  "success": true,
  "statusCode": 200,
  "message": "New access token retrieved successfully",
  "data": {
    "accessToken": "string"
  }
}
```


Forgot Password

```
  POST /api/v1/auth/forgot-password
  ```
| Parameter | Type     | Description                |Required|
| :-------- | :------- | :------------------------- |-----------|
| `email` | `string` | User's email address |✅|

### Response
```
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset email sent successfully",
  "data": null
}
```

### Reset Password
```
  POST /api/v1/auth/reset-password
```
| Parameter | Type     | Description                |Required|
| :-------- | :------- | :------------------------- |-----------|
| `token` | `string` | Password reset token |✅|
| `password` | `string` | New password |✅|

```
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset successfully",
  "data": null
}
```

## 💰 Wallet Management

 Get Wallet Balance
```
  GET /api/v1/wallet/balance
```
*Headers :* ``` Authorization: Bearer <access_token>```

Response:
```
{
  "success": true,
  "statusCode": 200,
  "message": "Wallet balance retrieved successfully",
  "data": {
    "balance": 1000,
    "currency": "BDT",
    "dailyLimit": 50000,
    "monthlyLimit": 150000,
    "dailySpent": 0,
    "monthlySpent": 0
  }
}
```

Add Money to Wallet
```
  POST /api/v1/wallet/add-money
```
*Headers :* ``` Authorization: Bearer <access_token>```

| Parameter | Type     | Description                |Required|
| :-------- | :------- | :------------------------- |-----------|
| `amount` | `number` |Amount to add|✅|
| `description` | `string` | Transaction description |❌|

Response :
```
{
  "success": true,
  "statusCode": 200,
  "message": "Payment initialized successfully",
  "data": {
    "paymentId": "string",
    "paymentUrl": "string",
    "transactionId": "string"
  }
}
```
Withdraw Money from Wallet
```
   POST /api/v1/wallet/withdraw
```
*Headers :* ``` Authorization: Bearer <access_token>```

| Parameter | Type     | Description                |Required|
| :-------- | :------- | :------------------------- |-----------|
| `amount` | `number` |Amount to add|✅|
| `description` | `string` | Transaction description |❌|

Response :
```
{
  "success": true,
  "statusCode": 200,
  "message": "Withdrawal payment initialized successfully",
  "data": {
    "paymentId": "string",
    "paymentUrl": "string",
    "transactionId": "string"
  }
}
```
 ### 💳 Payment Processing

 Initialize Payment

```http
  POST /api/v1/payment/init-payment/:userId
```
*Headers :* ``` Authorization: Bearer <access_token>```
Path Parameters:

| Parameter | Type     | Description                |Required|
| :-------- | :------- | :------------------------- |-----------|
| `userId` | `string` |user Id|✅|

### Retry Payment
```http
  POST /api/v1/payment/retry-payment/:paymentId
```
*Headers :* ``` Authorization: Bearer <access_token>```

| Parameter | Type     | Description                |Required|
| :-------- | :------- | :------------------------- |-----------|
| `paymentId` | `string` |Payment ID to retry|✅|

Response

```http
{
  "success": true,
  "statusCode": 200,
  "message": "Payment retry initialized successfully",
  "data": {
    "paymentId": "string",
    "paymentUrl": "string",
    "transactionId": "string",
    "amount": 100,
    "type": "string"
  }
}
```
***Have many More opration***
| path | oparation     | Description                |
| :-------- | :------- | :------------------------- |
| `api/v1/otp/verify` | post |verifyemail|
| `api/v1/otp/send` | post |send otp in email|
| `api/v1/agent/cash-in` | post |cashout any user wallet only aggent can do it|
| `api/v1/otp/cash-out` | post |cashin any user wallet only agent can do it|
| `api/v1/otp/send` | post |send otp in email|

### Admin

| path | oparation     | Description                |
| :-------- | :------- | :------------------------- |
| `api/v1/admin/getAlluser` | get |admin Acsess|
| `api/v1/admin/approvedAgent` | patch |approved agent role|
| `api/v1/admin/blockUser` | patch |bloack user |
| `api/v1/admin/blockAgent` | patch |block agent and his wallet |

### 📊 Response Status Codes
Status Code	Description

200  :	OK - Request successful
  
201  :	Created - Resource created successfully
  
400  :	Bad Request - Invalid input data
  
401  :	Unauthorized - Authentication required
  
403  :	Forbidden - Insufficient permissions
  
404  :	Not Found - Resource not found
  
500  :	Internal Server Error - Server error

### 🔐 Authentication Requirements
Most endpoints require authentication via JWT token in the Authorization header:
```test
Authorization: Bearer <access_token>
```
Some endpoints require specific roles:

---->User: Basic wallet operations

---->Agent: Cash-in/cash-out operations

---->Admin: User management and system oversight

### 📝 Error Responses
All error responses follow this format:

```response 
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```
Common error codes:

VALIDATION_ERROR - Input validation failed

AUTH_ERROR - Authentication/authorization error

NOT_FOUND - Resource not found

PAYMENT_ERROR - Payment processing error

DATABASE_ERROR - Database operation error