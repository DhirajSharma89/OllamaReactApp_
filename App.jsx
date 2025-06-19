import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ImageGen from "./pages/ImageGen";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <Header />
      <hr className="header-divider" />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/generate-image" element={<ImageGen />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
