import axios from "axios";
import React from "react";
import {Link} from "react-router-dom";
import Film from "./Film"
const Films = () => {
    const [films, setFilms] = React.useState < Array < Film >> ([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        getFilms()
    }, [])

    const getFilms = () => {
        axios.get('http://localhost:4941/api/v1/films')
            .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            setFilms(response.data.films)
            }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
        })
    }

    const list_of_films = () => {
        return films.map((item: Film) =>
            <tr key={item.filmId}>
                <th scope="row">{item.filmId}</th>
                <td>{item.title}</td>
                <td>{item.ageRating}</td>
                <td>{item.rating}</td>
                <td>{item.releaseDate}</td>
                <td>{item.genreId}</td>
                <td><Link to={"/films/" + item.filmId}>Go to film</Link></td>
            </tr>
        )
    }

    if (errorFlag) {
        return (
            <div>
                <h1>Films</h1>
                <div style={{ color: "red" }}>
                    {errorMessage}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Films</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Age Rating</th>
                            <th scope="col">Release Date</th>
                            <th scope="col">Genre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list_of_films()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Films;