import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/HomePage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CreatePost from "./Pages/CreatePost";
import BlogFeed from "./Pages/BlogFeed";
import PostDetail from "./Pages/PostDetails";
import EditPost from "./Pages/EditPost";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-posts" element={<CreatePost />} />
         <Route path="/feed" element={<BlogFeed />} />
           <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
           
      </Routes>
    </BrowserRouter>
  );
}

export default App;
