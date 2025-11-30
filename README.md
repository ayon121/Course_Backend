Auth Endpoints 
<h1>1. Custom Login </h1>
POST http://localhost:5000/api/v1/auth/login 
Body: { "email": "a@gmail.com", "password": "12345" } 
<h1>2. Logout </h1>
POST http://localhost:5000/api/v1/auth/logout 
<h1>3. Get Refresh Token </h1>
POST http://localhost:5000/api/v1/auth/refresh-token 
<h1>6. Reset Password </h1>
POST http://localhost:5000/api/v1/auth/reset-password 
Body: { "userId": "user-id", "token": "token", "newPassword": "new-password" }
<h1>1. Google Login </h1>
GET http://localhost:5000/api/v1/auth/google 
