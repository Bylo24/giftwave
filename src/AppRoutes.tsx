
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Gift from "@/pages/Gift";
import TestAnimation from "@/pages/TestAnimation";
import SelectAmount from "@/pages/SelectAmount";
import SelectRecipient from "@/pages/SelectRecipient";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gift" element={<Gift />} />
      <Route path="/testanimation" element={<TestAnimation />} />
      <Route path="/select-amount" element={<SelectAmount />} />
      <Route path="/select-recipient" element={<SelectRecipient />} />
    </Routes>
  );
};

export default AppRoutes;
