import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import LogIn from "./pages/LogIn";
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import CheckOut from "./components/CheckOut";
import SignUp from "./components/SighUp";
import Account from "./components/Account";

import Header from "./components/Header";

import "./App.css";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/account" element={<Account />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
