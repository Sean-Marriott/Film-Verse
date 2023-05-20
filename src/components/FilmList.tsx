import axios from 'axios';
import React, {useState} from "react";
import {
    AlertTitle,
    Alert,
    Pagination,
    SelectChangeEvent,
    FormControl,
    InputLabel, Select, OutlinedInput
} from "@mui/material";
import FilmListObject from "./FilmListObject";
import Grid from "@mui/material/Unstable_Grid2";
import Film from "./Film";
import MenuItem from "@mui/material/MenuItem";

const FilmList = () => {
    const [films, setFilms] = React.useState<Array<Film>>([])
    const [genres, setGenres] = React.useState < Array < Genre >> ([])
    const [filterGenres, setFilterGenres] = React.useState < Array < string >> ([])
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("")
    const [page, setPage] = useState(1);
    const filmsPerPage = 10;
    const pageCount = Math.ceil(films.length / filmsPerPage)



    React.useEffect(() => {
        getGenres()
        getFilms()
    }, [])


    React.useEffect(() => {
        getFilms()
    }, [filterGenres])

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };


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
        axios.get('http://localhost:4941/api/v1/films', {params: {
                genreIds: filterGenres
            }})
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setFilms(response.data.films)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
        console.log("Genres", filterGenres)
        console.log("Films", films)
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }
    const film_rows = () => films.slice((page - 1) * filmsPerPage, page * filmsPerPage).map((film: Film) => <Grid key={film.filmId}><FilmListObject film={film} genres={genres} /></Grid>)

    const handleChange = (event: SelectChangeEvent<typeof filterGenres>) => {
        const {
            target: { value },
        } = event;
        setFilterGenres(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        console.log(value)
    };


    return (
        <Grid container rowSpacing={2}>
            <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
                <h1>Films</h1>
            </Grid>
            <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
                <div>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="multiple-genre-label">Genre</InputLabel>
                        <Select
                            labelId="multiple-genre-label"
                            id="multiple-genre"
                            multiple
                            value={filterGenres}
                            onChange={handleChange}
                            input={<OutlinedInput label="Genres" />}
                            MenuProps={MenuProps}
                        >
                            {genres.map((genre) => (
                                <MenuItem
                                    key={genre.genreId}
                                    value={genre.genreId}
                                >
                                    {genre.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
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
