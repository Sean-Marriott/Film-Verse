import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import './index.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NotFound from "./components/NotFound";
import Film from "./components/Film";
import Navbar from "./components/Navbar";
import FilmList from "./components/FilmList";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddFilm from "./components/AddFilm";
import {LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient()

root.render(
    <div className="App">
        <QueryClientProvider client={queryClient}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Router>
                <Navbar />
                <div>
                    <Routes>
                        <Route path="/signup" element={<Signup/>}></Route>
                        <Route path="/login" element={<Login/>}></Route>
                        <Route path="/films" element={<FilmList/>}/>
                        <Route path="/film/:id" element={<Film/>}/>
                        <Route path="/addFilm" element={<AddFilm/>}></Route>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
            <ReactQueryDevtools />
            </LocalizationProvider>
        </QueryClientProvider>
    </div>
);
