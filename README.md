# MYSHOP — Full-Stack E-Commerce Platform
> **"Discover. Choose. Shop Smarter."**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-orange.svg)](https://www.mysql.com/)
[![Java](https://img.shields.io/badge/Java-17%2B-red.svg)](https://www.oracle.com/java/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

MYSHOP is a modern, responsive, production-style full-stack e-commerce web platform engineered for real-world retail performance. It combines modern minimalist design aesthetics with enterprise-grade backend capabilities, featuring proprietary algorithms like **MyShop Smart Score™**, a live **Deal Radar scanner**, multi-step checkout, interactive product comparison, and an administrative control suite.

---

## 1. System Architecture

```
React Frontend (Vite + React Router + Axios)
                    ↓
             REST API (JWT Auth)
                    ↓
Spring Boot Backend (Web + Security + Data JPA)
                    ↓
 Hibernate ORM / Relational Entities
                    ↓
MySQL Database (Relational Schema & Indexes)
```

Set a private JWT signing key before starting the backend. Generate a new key with:

```sh
export JWT_SECRET="$(openssl rand -base64 32)"
```

Keep the key private and stable across backend restarts; changing it invalidates existing login tokens.

---

## 2. Key Highlights & Features

### 🛍️ Customer Experience
- **Hero & Curated Discovery**: Large modern hero section with fluid entrance animations and rapid-access category shortcuts.
- **Dynamic Catalog Filtering**: Real-time search across names, tags, and brands with multi-faceted filtering:
  - Category selector
  - Price slider & range filters
  - Star rating thresholds (4.5★+, 4.0★+, 3.5★+)
  - In-stock availability toggle
  - Sorting: Price (Low→High, High→Low), Highest Rated, New Arrivals, Most Popular, and Smart Score.
- **Product Card Micro-Interactions**: Hover image zoom, Quick View modal with size/color pickers, one-click Wishlist heart toggle, compare drawer toggles, and stock warnings.
- **Product Details Showcase**: Multi-image thumbnail gallery, size & color variant selector, quantity stepper, specifications table, and verified customer review submissions.
- **Smart Recommendations ("Picked For You")**: Algorithmic product recommendation engine analyzing browsing habits and user affinity.
- **"Continue Exploring" (Recently Viewed)**: Seamlessly remembers visited products across user sessions.

### 🌟 Unique Innovations
1. **MyShop Smart Score™**:
   - Computes an objective 0–100 score for every item evaluating:
     - **Customer Ratings (40%)**: Verified star ratings out of 5.0.
     - **Review Volume (20%)**: Review density and crowd sentiment.
     - **Price-to-Discount Ratio (20%)**: Mathematical savings ratio.
     - **Stock Health (20%)**: Inventory availability and demand velocity.
2. **Deal Radar**:
   - Automatic scanner highlighting high-discount (≥25%), high-rated items with limited remaining units and a real-time countdown clock.
3. **Product Comparison Matrix**:
   - Compare up to 4 products side-by-side across specs, Smart Scores, prices, ratings, and variants.
4. **Shopping Insights**:
   - Personalized analytics dashboard inside the user profile tracking explored products, wishlist stats, order volumes, and favorite categories.

### 💳 Cart, Coupons & Multi-Step Checkout
- **Cart Management**: Dynamic calculation of subtotal, tiered delivery fees (Free above ₹999), 5% GST tax, and discounts.
- **Voucher / Promo Code Engine**:
  - `SAVE20` — 20% discount on orders above ₹999 (up to ₹1,000)
  - `MYSHOP10` — 10% discount on orders above ₹499 (up to ₹500)
  - `WELCOME15` — 15% discount for new shoppers (up to ₹400)
  - `FREESHIP` — 100% discount on shipping
- **Multi-Step Checkout**:
  - Step 1: Shipping Address snapshot
  - Step 2: Delivery Speed (Standard Ground vs. Priority Express)
  - Step 3: Simulated Payment Gateway (UPI with QR, Credit/Debit Cards, Cash on Delivery)
  - Step 4: Celebratory Confirmation Screen with animated confetti & generated Order ID.

### 📦 Order Management & Timeline
- Real-time Order Tracking Timeline: `Placed` → `Confirmed` → `Packed` → `Shipped` → `Delivered`.
- Full invoice snapshot and tracking summary.

### 🛡️ Administrative Control Panel
- **KPI Metrics**: Total Revenue, Total Orders, Total Products, Total Users.
- **Product Management (CRUD)**: Add, edit, and delete products, manage stock counts, variant tags, and Deal Radar status.
- **Category Management**: Create and organize product categories.
- **Order Fulfillment**: Change live order statuses across the workflow.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with JWT request & response interceptors
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, Modern CSS Transitions & Keyframes
- **Typography**: Plus Jakarta Sans & Inter

### Backend
- **Language**: Java 17+
- **Framework**: Spring Boot 3.3.4
- **Modules**:
  - Spring Web (RESTful APIs)
  - Spring Data JPA (Hibernate ORM)
  - Spring Security (JWT authentication & authorization)
  - Bean Validation (`jakarta.validation`)
- **Tokens**: JJWT 0.12.5 (HMAC-SHA256)
- **Password Security**: BCrypt Password Hashing

### Database
- **Primary Database**: MySQL 8.x / 9.x
- **In-Memory Fallback**: H2 Database (with H2 Web Console for instant zero-config testing)

---

## 4. Folder Structure

```
E Commerce tt/
├── frontend/                     # React Frontend
│   ├── public/                   # Public assets
│   ├── src/
│   │   ├── assets/               # Brand assets
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── QuickViewModal.jsx
│   │   │   ├── DealRadarSection.jsx
│   │   │   ├── ComparisonDrawer.jsx
│   │   │   ├── RecentlyViewed.jsx
│   │   │   ├── RecommendedForYou.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   └── ToastContainer.jsx
│   │   ├── context/              # React Context Providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── WishlistContext.jsx
│   │   │   ├── ComparisonContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/                # Application Routes
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Compare.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js            # Unified Axios Client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css             # Design Tokens & Styles
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── backend/                      # Spring Boot Backend
│   ├── src/main/java/com/myshop/
│   │   ├── config/               # SecurityConfig, CorsConfig, DataInitializer
│   │   ├── controller/           # REST Controllers
│   │   ├── dto/                  # Request & Response Data Transfer Objects
│   │   ├── entity/               # Relational Entities (User, Product, Order, etc.)
│   │   ├── exception/            # Global Exception Handlers
│   │   ├── repository/           # Spring Data JPA Repositories
│   │   ├── security/             # JWT Filter, Token Provider, UserPrincipal
│   │   ├── service/              # Core Business Logic Services
│   │   └── MyshopApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── application-mysql.properties
│   │   └── application-dev.properties
│   └── pom.xml
│
├── database/
│   └── myshop_schema_and_data.sql # Pure MySQL DDL & DML Script
└── README.md
```

---

## 5. Database Schema & Tables

The database schema is fully normalized and indexed:

| Table | Description |
| :--- | :--- |
| `users` | User credentials, roles (`ROLE_USER`, `ROLE_ADMIN`), contact information |
| `categories` | Category metadata, slugs, icons, and hero banners |
| `products` | Product pricing, stock, Smart Score, Deal Radar flags, variants |
| `reviews` | Customer ratings (1-5) and written feedback |
| `addresses` | Saved customer shipping addresses |
| `cart` | Persistent cart container mapped per user |
| `cart_items` | Cart line items with selected size, color, and quantity |
| `wishlists` | User wishlist container |
| `wishlist_items` | Saved wishlist items |
| `orders` | Completed orders, payment details, shipping address snapshot, status |
| `order_items` | Snapshot of purchased line items and historical prices |
| `coupons` | Active promo codes, discount percentages, limits, and order thresholds |

---

## 6. REST API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new customer
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated principal

### Products (`/api/products`)
- `GET /api/products` — Filter, search, and paginate catalog
- `GET /api/products/{id}` — Get single product by ID
- `GET /api/products/deal-radar` — Retrieve Deal Radar offers
- `GET /api/products/featured` — Retrieve featured products
- `GET /api/products/smart-score-top` — Retrieve highest-scoring items
- `GET /api/products/{id}/related` — Retrieve related items
- `POST /api/products` — Create product *(Admin only)*
- `PUT /api/products/{id}` — Update product *(Admin only)*
- `DELETE /api/products/{id}` — Delete product *(Admin only)*

### Categories (`/api/categories`)
- `GET /api/categories` — List all categories with product counts
- `POST /api/categories` — Create category *(Admin only)*

### Cart & Wishlist (`/api/cart`, `/api/wishlist`)
- `GET /api/cart` — Get user cart with calculated totals & coupons
- `POST /api/cart/items` — Add item to cart
- `PUT /api/cart/items/{id}` — Update item quantity/variants
- `DELETE /api/cart/items/{id}` — Remove item from cart
- `GET /api/wishlist` — View wishlist items
- `POST /api/wishlist/{productId}` — Toggle item in wishlist
- `POST /api/wishlist/{productId}/move-to-cart` — Move directly to cart

### Orders & Checkout (`/api/orders`)
- `POST /api/orders` — Place order (decrement inventory, clear cart, snapshot address)
- `GET /api/orders` — Get current user's order history
- `GET /api/orders/{id}` — Get order tracking details

### Admin Console (`/api/admin`)
- `GET /api/admin/dashboard` — Overview KPI stats & chart distributions
- `GET /api/admin/orders` — List and filter all platform orders
- `PUT /api/admin/orders/{id}/status` — Advance or update order fulfillment status

---

## 7. Default Credentials

For quick evaluation and testing:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@myshop.com` | `Admin@123` | Full Admin Dashboard & Storefront |
| **Demo User** | `user@myshop.com` | `User@123` | Customer Storefront, Cart, Orders |

*(The Login page also features one-click autofill buttons for both roles).*

---

## 8. Installation & Setup Guide

### Prerequisites
- **Node.js** (v18+) & **npm**
- **Java Development Kit** (JDK 17 or higher)
- **Apache Maven** (v3.8+)
- **MySQL** (v8.0+) *(Optional: in-memory H2 profile available for zero-config)*

---

### Step 1: Database Setup (MySQL)

1. Open your MySQL client (Workbench, CLI, or phpMyAdmin) and create the database:
   ```sql
   CREATE DATABASE myshop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. *(Optional)* Run the provided initialization script:
   ```bash
   mysql -u root -p myshop_db < database/myshop_schema_and_data.sql
   ```
   *(Note: The Spring Boot backend includes Hibernate `ddl-auto=update` and automatic data seeding on startup via `DataInitializer.java`, so tables and sample data will be created automatically upon backend launch).*

---

### Step 2: Configure Backend Database Connection

In `backend/src/main/resources/application.properties` (or `application-mysql.properties`), confirm your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/myshop_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

*(Alternatively, to run without MySQL, pass `-Dspring-boot.run.profiles=dev` to use the embedded H2 database).*

---

### Step 3: Run the Backend

```bash
cd backend
mvn clean spring-boot:run
```
The backend API server will start on: **`http://localhost:8080`**

---

### Step 4: Run the Frontend

In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will start on: **`http://localhost:5173`**

Open **`http://localhost:5173`** in your browser.

---

## 9. Testing & Evaluation Walkthrough

1. **Browse Catalog**: Visit the Home page and inspect the Hero section, Categories, and Deal Radar.
2. **Product Details & Smart Score**: Click on any product (e.g., *AuraPulse ANC Headphones*). Check out the Smart Score breakdown, select variants, and read customer reviews.
3. **Compare Products**: Click the "Scale" icon on 2 or 3 products, then click "Compare" in the floating bottom drawer to view the side-by-side comparison matrix.
4. **Shopping Cart & Coupons**: Add items to the cart, navigate to `/cart`, and enter coupon code `SAVE20` to verify live 20% discount calculation.
5. **Checkout**: Proceed through the 4-step checkout process. Select simulated UPI, Card, or COD, and confirm the order to trigger the celebratory confetti.
6. **Order Tracking**: Go to "My Orders" in the navigation dropdown to inspect the real-time fulfillment timeline.
7. **Admin Dashboard**: Log in with `admin@myshop.com` / `Admin@123` and visit `/admin` to inspect real-time metrics, update order statuses, and add or edit products.

---

## 10. License
This project is open-source under the [MIT License](LICENSE).
