import {useEffect, useState} from "react";

export const useWindowSize = () => {
    const[similarFilmsPerPage, setSimilarFilmsPerPage] = useState(1)
    const handleResize = () => {
        if (window.innerWidth > 0) setSimilarFilmsPerPage(1)
        if (window.innerWidth > 630) setSimilarFilmsPerPage(2)
        if (window.innerWidth > 850) setSimilarFilmsPerPage(3)
        if (window.innerWidth >= 900) setSimilarFilmsPerPage(1)
        if (window.innerWidth > 1060) setSimilarFilmsPerPage(2)
        if (window.innerWidth > 1500) setSimilarFilmsPerPage(3)
    }

    useEffect(() => {
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])
    return similarFilmsPerPage;
}
