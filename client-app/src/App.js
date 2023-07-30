// import logo from './logo.svg';
// import './App.css';
import { Routes, Route } from "react-router-dom";

import { PostList } from "./components/PostList";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<PostList />}></Route>
        <Route path="/posts/:id" element={<h1>Post</h1>}></Route>
      </Routes>
    </div>
  )
}

export default App;
