import axios from 'axios';
import React, {useState} from "react";
import {AlertTitle, Alert, Pagination} from "@mui/material";
import FilmListObject from "./FilmListObject";
import Grid from "@mui/material/Unstable_Grid2";
import Film from "./Film";

const FilmList = () => {
    const [films, setFilms] = React.useState<Array<Film>>([])
    const [genres, setGenres] = React.useState < Array < Genre >> ([])
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("")
    const [page, setPage] = useState(1);
    const filmsPerPage = 10;
    const pageCount = Math.ceil(films.length / filmsPerPage)

    React.useEffect(() => {
        getGenres()
        getFilms()
    }, [setGenres, setFilms])
    const getGenres = () => {
        axios.get('http://localhost:4941/api/v1/films/genres')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setGenres(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

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

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }
    const film_rows = () => films.slice((page - 1) * filmsPerPage, page * filmsPerPage).map((film: Film) => <FilmListObject key={film.filmId + film.title} film={film} genres={genres} />)

    return (
        <Grid container rowSpacing={2}>
            <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
                <h1>Films</h1>
            </Grid>
            <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
                <Grid container spacing={6} display="flex" justifyContent="center" alignItems="center" disableEqualOverflow>
                    {errorFlag?
                        <Alert severity="error">
                            <AlertTitle> Error </AlertTitle>
                            { errorMessage }
                        </Alert>: ""}
                    { film_rows() }
                </Grid>
            </Grid>
            <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
                <Pagination count={pageCount} page={page} onChange={handlePageChange}  />
            </Grid>
        </Grid>
    )
}

export default FilmList;
