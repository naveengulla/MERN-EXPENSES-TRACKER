import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import HeroSection from "./components/Home/HomePage";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import LoginForm from "./components/Users/Login";
import RegistrationForm from "./components/Users/Register";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import { getUserFromStorage } from "./utils/getUserFromStorage";
import { useSelector } from "react-redux";
import AddCategory from "./components/Category/AddCategory";
import CategoriesList from "./components/Category/CategoriesList";
import UpdateCategory from "./components/Category/UpdateCategory";
import TransactionForm from "./components/Transactions/TransactionForm";
import Dashboard from "./components/Users/Dashboard";
import UserProfile from "./components/Users/UserProfile";

function App() {
  //const token= getUserFromStorage();
  const user = useSelector((state) => state.auth?.user);
  return (
    <BrowserRouter>
      {user ? <PrivateNavbar /> : <PublicNavbar />}
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        { user && <Route path="/add-category" element={<AddCategory />} /> }
        {user && <Route path="/categories" element={<CategoriesList />} />}
        {user &&  <Route path="/update-category/:id" element={<UpdateCategory />} />}
        {user && <Route path="/add-transaction" element={<TransactionForm />} />}
        { user && <Route path="/dashboard" element={<Dashboard />} />}
        { user && <Route path="/profile" element={<UserProfile />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
