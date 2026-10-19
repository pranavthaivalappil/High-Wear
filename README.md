# HIGH WEAR

HIGH WEAR is a premium, high-performance, and immersive full-stack e-commerce marketplace built using the MERN stack. Designed with custom aesthetics, fluid animations, and real-time state synchronization, the platform handles user authentication, product catalogs, department groupings, secure Razorpay payments, and live inventory broadcasts.

---

##  Key Features

*   **Premium & Immersive Frontend**: A sleek interface powered by **React** and styled with standard CSS variables and Bootstrap. Fluid micro-interactions and page transitions are engineered using the **GSAP (GreenSock Animation Platform)**.
*   **Secure Payment Pipeline**: Integrated **Razorpay API** supporting secure checkout. Features strict server-side transaction verification using **HMAC-SHA256 cryptographic signatures**.
*   **ACID-Compliant Checkout Transactions**: Leverages **MongoDB multi-document session transactions** during order placement. In the event of network drops, payment failures, or sudden inventory shortfalls, all database operations automatically rollback to prevent double-spending or overselling.
*   **Real-Time Stock Synchronization**: Integrated **Socket.io** broadcast server that notifies all active clients of inventory adjustments immediately upon purchase, avoiding the overhead of client-side HTTP polling.
*   **Smart Recommendation Engine**: A custom content-based filtering system implemented in-memory. Calculates product similarity scores by analyzing title keyword tokenization, brand alignment, and retail price proximity to return the top four recommendations.
*   **Streamlined Data Ingestion**: Features custom seeder scripts that read raw retail product files (`products.csv`) via streams, map them dynamically to targeted high-resolution Unsplash fashion images, and batch-upload them to MongoDB Atlas.

---

##  Technology Stack

### Frontend
*   **Core**: React 19, Vite, JavaScript
*   **Routing**: React Router DOM (v7)
*   **Styling & Icons**: Bootstrap 5, Bootstrap Icons, Vanilla CSS (Variables-driven)
*   **Animations**: GSAP, @gsap/react
*   **State & Networking**: Axios, Context API, Socket.io-Client

### Backend
*   **Core**: Node.js, Express.js (v5)
*   **Database**: MongoDB Atlas, Mongoose ODM
*   **Authentication**: JSON Web Tokens (JWT), bcryptjs
*   **Payments**: Razorpay Node SDK
*   **Real-time Messaging**: Socket.io (WebSocket Server)
*   **Data Processing**: csv-parser

---

##  Repository Structure

```text
ApolloMarket/
├── backend/
│   ├── archive/              # Contains products.csv data file
│   ├── middleware/           # authMiddleware for JWT validation
│   ├── models/               # Mongoose Schemas (User, Product, Department, Order)
│   ├── loadProducts.js       # Stream seeder for product CSV
│   ├── migrateDepartments.js # Seeder for department setup
│   ├── server.js             # Main server & Socket.io server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Pages (Home, Shop, Cart, ProductDetails, MyOrders, Auth)
│   │   ├── context/          # AuthContext and CartContext hooks
│   │   ├── services/         # Socket and API clients
│   │   ├── App.jsx           # Main Router layout
│   │   └── index.css         # Custom CSS Design tokens
│   └── package.json
└── README.md                 # Project Documentation
```

---

##  Setup & Installation

### Prerequisites
*   Node.js (v18, v20, or v22)
*   MongoDB Atlas cluster connection URI
*   Razorpay merchant account API credentials (`Key ID` and `Key Secret`)

### 1. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `backend` folder and populate it with:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_token
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

### 2. Database Migration & Seeding
Populate the database with default departments and product data:
1. Run the department migration:
   ```bash
   node migrateDepartments.js
   ```
2. Run the CSV product seeder:
   ```bash
   node loadProducts.js
   ```

### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the development server configuration. By default, API calls are targeted to `http://localhost:5000`.

### 4. Running the Application
Start both servers in development mode:

*   **For Backend** (in `backend/` directory):
    ```bash
    npm run dev
    ```
*   **For Frontend** (in `frontend/` directory):
    ```bash
    npm run dev
    ```

Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

---

## 🔌 API Documentation

### Authentication
*   `POST /api/auth/register` - Create a new user profile.
*   `POST /api/auth/login` - Authenticate and return a JWT.

### Products & Store Catalog
*   `GET /api/products` - Retrieve paginated products with optional queries for `search`, `brand`, `category`, `department_id`, `minPrice`, and `maxPrice`.
*   `GET /api/products/:id` - Fetch details for a single product (supports numeric ID or ObjectId).
*   `GET /api/products/:id/recommendations` - Compute and return the top 4 related products using the content-similarity algorithm.
*   `GET /api/departments` - Fetch list of departments.
*   `GET /api/filters` - Fetch product filtering bounds (min/max price, categories, and brands).
*   `GET /api/stats` - Fetch aggregate counts for dashboard metrics.

### Checkout & Orders
*   `POST /api/create-razorpay-order` - Generate a Razorpay payment order token.
*   `POST /api/orders` - Verify cryptographic signature, deduct stock transactionally, and record complete order details.
*   `GET /api/orders/me` - Fetch historical checkout invoices for the authenticated user.

---

## 🛠️ WebSocket Events
*   **Connection**: Clients connect to the base Socket.io server to listen to broadcasts.
*   **`stock_update`**: Emits payload containing updated inventory status:
    ```json
    {
      "product_id": "64d0a1b2c3...",
      "new_inventory": 42
    }
    ```
    Upon receiving this event, the frontend automatically adjusts active stock listings without requiring page reloads.
