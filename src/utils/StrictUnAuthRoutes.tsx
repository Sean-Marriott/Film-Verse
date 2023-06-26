import {Navigate, Outlet} from "react-router-dom"

const StrictUnAuthRoutes = () => {
    const authToken = localStorage.getItem("authToken")

    return (
        !authToken ? <Outlet/> : <Navigate to={"/profile"}/>
    )
}

export default StrictUnAuthRoutes