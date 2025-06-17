import { useEffect } from "react";
import { Routes, Route, useNavigationType, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Order from "./AdminPage/Order";
import Sales from "./AdminPage/Sales";
import Product from "./AdminPage/Product";
import Category from "./AdminPage/Category";
import Admin from "./AdminPage/Admin";
import Dashboard from "./AdminPage/Dashboard";
import Login from "./pages/Login";
import About from "./pages/About";

import UserOrder from "./UserPage/Order";
import UserSales from "./UserPage/Sales";
import UserProduct from "./UserPage/Product";
import UserCategory from "./UserPage/Category";
import UserDashboard from "./UserPage/Dashboard";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
      case "/Order":
        title = "";
        metaDescription = "";
        break;
      case "/sales":
        title = "";
        metaDescription = "";
        break;
      case "/product":
        title = "";
        metaDescription = "";
        break;
      case "/category":
        title = "";
        metaDescription = "";
        break;
      case "/admin":
        title = "";
        metaDescription = "";
        break;
      case "/dashboard":
        title = "";
        metaDescription = "";
        break;
      case "/login":
        title = "";
        metaDescription = "";
        break;
      case "/about":
        title = "";
        metaDescription = "";
        break;
      // user page urls
      case "/UserOrder":
        title = "";
        metaDescription = "";
        break;
      case "/UserSales":
        title = "";
        metaDescription = "";
        break;
      case "/UserProduct":
        title = "";
        metaDescription = "";
        break;
      case "/UserCategory":
        title = "";
        metaDescription = "";
        break;
      case "/UserDashboard":
        title = "";
        metaDescription = "";
        break;
      default:
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag: HTMLMetaElement | null = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Order" element={<Order />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/product" element={<Product />} />
      <Route path="/category" element={<Category />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      {/* User Page Routes */}
      <Route path="/UserOrder" element={<UserOrder />} />
      <Route path="/UserSales" element={<UserSales />} />
      <Route path="/UserProduct" element={<UserProduct />} />
      <Route path="/UserCategory" element={<UserCategory />} />
      <Route path="/UserDashboard" element={<UserDashboard />} />
    </Routes>
  );
}

export default App;
