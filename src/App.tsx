import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import useAuthStore from "./store/userAuthStore";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import UserTypeCheck from "./utils/UserTypeCheck";
import Layout from "./components/Layout/Layout";
import NotFound from "./pages/NotFound";
import NotAuthorized from "./pages/NotAuthorized";
import Landing from "./pages/Landing";
import Homepage from "./pages/HR/Homepage";
import InterviewerHome from "./pages/Interviewer/Homepage";
import FeedbackForm from "./pages/Interviewer/FeedbackForm";

function App() {
  const { authToken, userType, id } = useAuthStore();

  // User is logged in if `authToken` exists
  const isLoggedIn = !!authToken;

  const userRoute = `/user/${userType}/${id}`;
  return (
    <>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to={userRoute} replace /> : <Landing />
            }
          />
          <Route path="/test" element={<>Route testing</>} />

          {/* Protected Routes for student */}
          <Route
            path="/user/hr/:id"
            element={
              <ProtectedRoutes isLoggedIn={isLoggedIn}>
                <UserTypeCheck>
                  <Layout />
                </UserTypeCheck>
              </ProtectedRoutes>
            }
          >
            <Route index element={<Homepage />} />
          </Route>

          {/* Protected Routes for faculty */}
          <Route
            path="/user/interviewer/:id"
            element={
              <ProtectedRoutes isLoggedIn={isLoggedIn}>
                <UserTypeCheck>
                  <Layout />
                </UserTypeCheck>
              </ProtectedRoutes>
            }
          >
            <Route index element={<InterviewerHome />} />
            <Route path="feedback" element={<FeedbackForm />} />
          </Route>

          {/* Not Authorized Page */}
          <Route
            path="/not-authorized"
            element={
              isLoggedIn ? (
                <Navigate to={userRoute} replace />
              ) : (
                <NotAuthorized />
              )
            }
          />

          {/* Catch-All for Page Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
