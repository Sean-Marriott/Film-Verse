import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NotFound from "./components/NotFound";
import Films from "./components/Films";
import Film from "./components/Film";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <div className="App">
        <Router>
            <div>
                <Routes>
                    <Route path="/films" element={<Films/>}/>
                    <Route path="/films/:id" element={<Film/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </div>
        </Router>
    </div>
);
