import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Search from "./components/Search";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <div className="App">
        <Router>
            <div>
                <Routes>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/search" element={<Search/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </div>
        </Router>
    </div>
);
