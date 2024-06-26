import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/Routes/ProtectedRoute";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegistrationPage from "./pages/Registration";
import UserPage from "./pages/User";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login/:errStatus?" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
