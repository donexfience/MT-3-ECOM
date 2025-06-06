import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import { ToastContainer } from "react-fox-toast";

function App() {
  return (
    <>
      <ToastContainer />

      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />

          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<SignIn />} />

          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
