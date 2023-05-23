import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NotFound from "./components/NotFound";
import Film from "./components/Film";
import Navbar from "./components/Navbar";
import FilmList from "./components/FilmList";
import Login from "./components/Login";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <div className="App">
        <Navbar />
        <Router>
            <div>
                <Routes>
                    <Route path="/login" element={<Login/>}></Route>
                    <Route path="/films" element={<FilmList/>}/>
                    <Route path="/film/:id" element={<Film/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </div>
        </Router>
    </div>
);
