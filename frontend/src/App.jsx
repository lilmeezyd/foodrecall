import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Fda from "./pages/Recalls/Fda";
import Usda from "./pages/Recalls/Usda";
import ApiProvider from "./pages/ApiProvider";
import About from "./pages/About";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UsdaRecall from "./pages/UsdaRecall";
import FdaRecall from "./pages/FdaRecall";
import Unknown from "./pages/Unknown";
import RecallProvider from "./RecallContext";
import AuthenticationProvider from "./AuthenticationContext";
import Subscribe from "./pages/Subscribe";
import Unsubscribe from "./pages/Unsubscribe";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ResetPassword from "./pages/ResetPassword";
import SubscribeMsg from "./pages/SubscribeMsg";
import PrivateRoute from "./router/PrivateRoute";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <Router> 
      <AuthenticationProvider>
        <RecallProvider>
          <div className="container">
            <Header />
            <ToastContainer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recalls/fda" element={<Fda />} />
              <Route path="/recalls/usda" element={<Usda />} />
              <Route path="/recalls/fda/:fdaId" element={<FdaRecall />} />
              <Route path="/recalls/usda/:usdaId" element={<UsdaRecall />} />
              <Route path="/api-provider" element={<ApiProvider />} />
              <Route path="/about-us" element={<About />} />
              <Route element={<PrivateRoute />}>
                <Route path="/send-updates" element={<SubscribeMsg/>} />
              </Route>
              
              <Route path="/cap10denz/login" element={<Login />} />
              <Route path="/cap10denz/register" element={<Register />} />
              <Route
                path="/request-password-reset"
                element={<RequestPasswordReset />}
              />
              <Route path="/password-reset" element={<ResetPassword />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="*" element={<Unknown Request />} />
            </Routes>
          </div>
          <Footer />
        </RecallProvider>
      </AuthenticationProvider>
    </Router>
  );
}

export default App;
