Personal Financial Records API
This is a RESTful API for managing personal financial records, allowing users to record income and expenses, retrieve past transactions, and get summaries by category or time period.

Technologies Used
Backend: Node.js with Express.js
Database: SQLite (or MongoDB if preferred)
Authentication: JWT-based (optional, can be skipped for simplicity)
Tools: Postman for API testing
Setup Instructions
Prerequisites
Node.js and npm installed on your machine.
SQLite or MongoDB installed (depending on the database you want to use).
Postman for testing (optional, but recommended).
Installation

1. Initial Setup
**Create a new Node.js project.**
    mkdir finance-manager-api
    cd finance-manager-api
    npm init -y
**Install necessary dependencies:**
  npm install express sqlite3 body-parser
**Add User Authentication with JWT**
  To implement JWT-based user authentication, we'll need to install the necessary packages and create routes for user registration and login.
**Install bcryptjs for password hashing and jsonwebtoken for generating and verifying tokens.**
  npm install bcryptjs jsonwebtoken
**Install nodemon for easier development (auto-restarts server on file changes).**
  npm install --save-dev nodemon
**Add a start script to package.json:**
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}

**Clone the repository:**

git clone https://github.com/your-username/personal-financial-api.git
Navigate to the project directory:
cd personal-financial-api

**Database Setup:**

For SQLite: The SQLite database file will be created automatically.
For MongoDB: Set up a MongoDB instance and update the connection URL in the code.

PORT=3000
JWT_SECRET=your_jwt_secret_key
**Run the application:**
  npm start
Access the API:

The API will run at http://localhost:3000.


**1. Project Structure**


financial-records-api/
├── auth.js
├── db.js
├── index.js
├── middleware/
│   └── auth.js
└── package.json


To check if all the endpoints of your Personal Financial Records API are working correctly in Postman, follow the steps below:

1. Set Up Postman
Download Postman from Postman website and install it.
Launch Postman after installation.
2. Check Authentication Endpoints
**1. Register a New User**
Method: POST
URL: http://localhost:3000/auth/register
Body: Select raw and JSON format in the body section, then enter the following:json

{
  "username": "testuser",
  "password": "password123"
}
Click "Send".
Expected Response:json

{
  "message": "User registered successfully"
}

**postman screenshot**
![image](https://github.com/user-attachments/assets/cf3ddd84-cb80-4aab-8500-0104cfbf0791)


**2. Login to Get a JWT Token**
Method: POST
URL: http://localhost:3000/auth/login
Body: Select raw and JSON format, then enter:json
{
  "username": "testuser",
  "password": "password123"
}

Click "Send".
Expected Response:json


{
  "message": "Login successful",
  "token": "your_jwt_token_here"
}

![image](https://github.com/user-attachments/assets/cdbf2ec5-576f-4f2d-9d19-7ea6fe7c3714)

Copy the JWT token from the response for the next steps.
**3. Check Transaction Endpoints (Authenticated)**
For all further requests, you need to add the JWT token in the Authorization tab.

Go to Authorization tab in Postman.
Set Type to Bearer Token.
Paste the JWT token in the Token field.
Now, check the following endpoints:
![image](https://github.com/user-attachments/assets/f143afb0-542c-4585-8c41-56883dfc31d0)

**1. Add a New Transaction**
Method: POST
URL: http://localhost:3000/transactions
Body: Select raw and JSON format. Enter either the single object or array depending on whether you're sending one or multiple transactions.
Step 3: Testing with Postman
Single Transaction:

Send a single transaction as a JSON object.
The server will insert it into the database and return a success message.
Multiple Transactions:

Send an array of transactions in a single request.
The server will loop through the array, insert each transaction, and return a success message for all transactions.

For Single Transaction:json

{
  "message": "Transaction(s) added successfully",
  "results": [
    { "transactionId": 1 }
  ]
}


![image](https://github.com/user-attachments/assets/75b30672-ac8d-430a-8997-dc99e9e55e1e)

For Multiple Transactions:json

{
  "message": "Transaction(s) added successfully",
  "results": [
    { "transactionId": 2 },
    { "transactionId": 3 }
  ]
}

![image](https://github.com/user-attachments/assets/42d0020d-28c7-44e7-bcdb-3e99b1cd0747)


**2. Get All Transactions (With Pagination)**
Method: GET
URL: http://localhost:3000/transactions?page=1&limit=10
Click "Send".
Expected Response:json

{
  "page": 1,
  "totalPages": 1,
  "limit": 10,
  "totalTransactions": 1,
  "transactions": [
    {
      "id": 1,
      "type": "income",
      "category": "Salary",
      "amount": 1500,
      "date": "2023-09-01",
      "description": "Monthly salary",
      "userId": 1
    }
  ]
}
**3. Get a Specific Transaction by ID**
Method: GET
URL: http://localhost:3000/transactions/1
Click "Send".
Expected Response:

json
Copy code
{
  "id": 1,
  "type": "income",
  "category": "Salary",
  "amount": 1500,
  "date": "2023-09-01",
  "description": "Monthly salary",
  "userId": 1
}
**4. Update a Transaction by ID**
Method: PUT
URL: http://localhost:3000/transactions/1
Body: Select raw and JSON format, then enter the following:
json

{
  "type": "income",
  "category": "Freelance",
  "amount": 2000,
  "date": "2023-09-05",
  "description": "Freelance project"
}
Click "Send".
Expected Response:json

{
  "message": "Transaction updated successfully"
}
**5. Delete a Transaction by ID**
Method: DELETE
URL: http://localhost:3000/transactions/1
Click "Send".
Expected Response:json

{
  "message": "Transaction deleted successfully"
}
**6. Check Summary Endpoint**
Get a Summary of Transactions
Method: GET
URL: http://localhost:3000/summary?startDate=2023-09-01&endDate=2023-09-30&category=Salary&timePeriod=monthly
Click "Send".
Expected Response:json

[
  {
    "type": "income",
    "total": 1500
  }
]


**7. Delete all Transactions**
Method: DELETE
URL: http://localhost:3000/transactions
Click "Send".
Expected Response:json

{
  "message": "50 transactions deleted successfully."
}

**8. Get All Transactions**
Method: GET 
URL: http://localhost:3000/transactions
Description: Retrieves all transactions.
Response:json

[
  {
    "id": 1,
    "type": "income",
    "category": "Salary",
    "amount": 1500,
    "date": "2024-09-01",
    "description": "Monthly salary"
  },
  {
    "id": 2,
    "type": "expense",
    "category": "Rent",
    "amount": 800,
    "date": "2024-09-01",
    "description": "Rent payment"
  }
]

5. Error Handling Testing
You should also test error scenarios, such as:

Invalid login credentials.
Missing fields in the transaction request.
Fetching or updating a transaction that doesn't exist.
This will help ensure your API responds appropriately to errors and invalid data.

6. Summary
By following these steps in Postman:

Register a user.
Login to get a JWT token.
Use the token to test:
Adding transactions.
Fetching all transactions with pagination.
Fetching, updating, and deleting specific transactions.
Generate a summary of transactions.
Testing each endpoint in Postman verifies your API functionality and ensures that it handles both success and error scenarios effectively.
