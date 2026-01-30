import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import LeaderBoard from "./pages/LeaderBoard";
import Explore from "./pages/Explore";
import PlayList from "./pages/PlayList";
import SongPage from "./pages/SongPage";

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
        <Route path="/track" element={<SongPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AllRoutes;
