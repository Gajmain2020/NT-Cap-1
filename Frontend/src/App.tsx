import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout/Layout";
import HRCalendar from "./pages/HR/Calendar";
import Homepage from "./pages/HR/Homepage";
import PastInterviews from "./pages/HR/PastInterviews";
import Report from "./pages/HR/Report";
import UpcomingInterviews from "./pages/HR/UpcomingInterviews";
import InterviewerCalendar from "./pages/Interviewer/Calendar";
import FeedbackForm from "./pages/Interviewer/FeedbackForm";
import InterviewerHome from "./pages/Interviewer/Homepage";
import InterviewerUpcomingInterviews from "./pages/Interviewer/InterviewerUpcomingInterviews";
import Landing from "./pages/Landing";
import NotAuthorized from "./pages/NotAuthorized";
import NotFound from "./pages/NotFound";
import useAuthStore from "./store/userAuthStore";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import UserTypeCheck from "./utils/UserTypeCheck";

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
            <Route
              path="upcoming-interviews"
              element={<UpcomingInterviews />}
            />
            <Route path="past-interviews" element={<PastInterviews />} />
            <Route path="past-interviews/:reportId" element={<Report />} />
            <Route path="calendar" element={<HRCalendar />} />
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
            <Route
              path="upcoming-interviews"
              element={<InterviewerUpcomingInterviews />}
            />
            <Route path="feedback" element={<FeedbackForm />} />
            <Route path="calendar" element={<InterviewerCalendar />} />
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
