# 👕 TeeStore: Custom Apparel Made Easy
## 🚀 [Link to the Website](https://project-apparel.vercel.app)

<br>

## 🌟 Overview & Inspiration

**TeeStore** is a modern, responsive e-commerce application specializing in customizable apparel and printing services.

This project was built out of inspiration from my **uncle's apparel manufacturing business**, serving as a fully functional and highly customizable digital storefront. It aims to demonstrate how modern web development can streamline a traditional business, offering users a seamless way to design custom clothing, manage their cart, and, critically, **initiate order processing** through instant communication.

-----

## ✨ Features

  * **Responsive Header & Navigation:** A sticky, blue-themed header with a clean, fully collapsible and centered mobile navigation menu.
  * **Direct WhatsApp Order Submission:** Features an **instant communication link** strategically placed on the order confirmation screen to facilitate **sending the final order details** to the team for immediate processing and subsequent communication.
  * **Customizable Products:** Dedicated product pages for users to view details and customize items before purchase.
  * **Secure Authentication:** User signup and login pages with form validation and a secure **password visibility toggle** for enhanced user experience.
  * **Shopping Cart Management:** Functionality to add, update, and remove items from the cart.
  * **Order History:** A dedicated page for users to track their past orders.
  * **Modern UI/UX:** Clean, accessible design implemented with pure CSS for custom styling, including smooth animations and mobile-friendly layouts.

-----

## 🚀 Getting Started

### Prerequisites

You'll need the following software installed:

  * **Node.js** and **npm** (or yarn)
  * A backend API running to handle authentication and data persistence.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [Your Repository URL Here]
    cd ProjectApparel
    ```
2.  **Install dependencies for the Frontend (Client):**
    ```bash
    cd client
    npm install
    # or
    yarn install
    ```
3.  **Install dependencies for the Backend (Server):**
    ```bash
    cd ../server
    npm install
    # or
    yarn install
    ```
4.  **Seed the Database (Optional but Recommended):**
    *This populates your database with initial data (e.g., sample products).*
    ```bash
    node seeder.js
    ```

### Run the Application

1.  **Start the Backend API (Server):**
    *In the `server` directory.*
    ```bash
    npm start
    # or use a common development command like 'npm run dev' if defined in the server's package.json
    ```
2.  **Start the Frontend Application (Client):**
    *Open a **new terminal** tab/window and navigate to the `client` directory.*
    ```bash
    cd ../client
    npm start
    # or
    yarn start
    ```
    The frontend application will typically open in your browser at **`http://localhost:3000`**.

-----

## 📁 Project Structure

Key files and folders in this repository:

| File/Directory | Description |
| :--- | :--- |
| `src/pages/LoginPage.jsx` | Handles user sign-in logic and form rendering (includes password toggle). |
| `src/pages/SignupPage.jsx` | Handles user account creation logic and form rendering (includes password toggle). |
| `src/context/AuthContext.jsx` | Centralized context for user authentication (`login`, `signup`, `logout`). |
| `src/pages/CustomizePage.jsx` | Product detail and customization view. |
| `src/pages/CartPage.jsx` | Component for viewing and managing the shopping cart. |
| `src/pages/OrderNowPage.jsx` | Checkout process, final order summary, and dedicated component for WhatsApp order submission. |


-----



