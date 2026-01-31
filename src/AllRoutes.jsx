import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import LeaderBoard from "./pages/LeaderBoard";
import Explore from "./pages/Explore";
import PlayList from "./pages/PlayList";
import SongPage from "./pages/SongPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminArtists from "./pages/AdminArtists";
import AdminMusic from "./pages/AdminMusic";
import AdminUsers from "./pages/AdminUsers";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import GlobalPlayer from "./GlobalPlayer";

function AllRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/playlist" element={<PlayList />} />
        <Route path="/track/:id" element={<SongPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/artists" element={<AdminArtists />} />
        <Route path="/admin/music" element={<AdminMusic />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
      <GlobalPlayer />
    </BrowserRouter>
  );
}

export default AllRoutes;
