// import logo from './logo.svg';
// import './App.css';
import { Routes, Route } from "react-router-dom";

import { Post } from "./components/Post";
import { PostList } from "./components/PostList";
import { PostProvider } from "./context/PostContext";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<PostList />}></Route>
        <Route path="/posts/:id" element={<PostProvider>
          <Post />
        </PostProvider>}></Route>
      </Routes>
    </div>
  )
}

export default App;
