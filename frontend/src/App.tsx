import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Admin from "./Admin";
import User from "./User";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
        <Route path="/" element={<Navigate to="/user" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
