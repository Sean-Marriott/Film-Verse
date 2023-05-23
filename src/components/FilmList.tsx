import {AxiosError} from 'axios';
import React, {useState} from "react";
import {
    Pagination,
    SelectChangeEvent,
    FormControl,
    InputLabel, Select, OutlinedInput, TextField, InputAdornment, CircularProgress
} from "@mui/material";
import FilmListObject from "./FilmListObject";
import Grid from "@mui/material/Unstable_Grid2";
import Film from "./Film";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import {useQuery} from "react-query";
import {getFilmsParametrised, getGenres} from "../api/filmsApi";

const FilmList = () => {
    const [searchTerm, setSearchTerm] = React.useState('')
    const [sort, setSort] = React.useState("RELEASED_ASC")
    const [filterGenres, setFilterGenres] = React.useState < Array < string >> ([])
    const [filterAgeRatings, setFilterAgeRatings] = React.useState < Array < string >> ([])
    const [page, setPage] = useState(1)
    const FILMS_PER_PAGE = 10;

    const { data: genres, status: genresStatus, error: genresError } = useQuery('genres', getGenres)
    const { data, status: filmsStatus, error: filmsError } = useQuery(
        ['films', searchTerm, sort, filterGenres, filterAgeRatings],
        () => getFilmsParametrised(searchTerm, filterGenres, filterAgeRatings, sort))

    React.useEffect(() => {
    }, [])

    const ageRatings = [
        "G",
        "PG",
        "M",
        "R13",
        "R16",
        "R18",
        "TBC"
    ]

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

    function getGenre(genreId: number): string {
        for (const Genre of genres) {
            if (Genre.genreId === genreId) { return Genre.name }
        }
        return "undefined"
    }

    function convertToDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }

    const filterGenre = (event: SelectChangeEvent<typeof filterGenres>) => {
        const {
            target: { value },
        } = event;
        setFilterGenres(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const filterAgeRating = (event: SelectChangeEvent<typeof ageRatings>) => {
        const {
            target: { value },
        } = event;
        setFilterAgeRatings(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const filterSort = (event: SelectChangeEvent) => {
        setSort(event.target.value);
    };


    function filmError(): string {
        const filmError = filmsError as Error | AxiosError
        return "Error retrieving films: " + filmError.message
    }

    function genreError(): string {
        const genreError = genresError as Error | AxiosError
        return "Error retrieving genres: " + genreError.message
    }

    return (
        <Grid container rowSpacing={2} sx={{m:2}}>
            <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
                <h1>Films</h1>
            </Grid>
            <Grid container rowSpacing={{xs:0}} xs={12} display="flex" justifyContent="center" alignItems="center">
                <Grid display="flex">
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <TextField
                            id="standard-basic"
                            label="Search"
                            variant="outlined"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid display="flex">
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="multiple-genre-label">Genre</InputLabel>
                        <Select
                            labelId="multiple-genre-label"
                            id="multiple-genre"
                            multiple
                            value={filterGenres}
                            onChange={filterGenre}
                            input={<OutlinedInput label="Genres" />}
                            MenuProps={MenuProps}
                        >
                            {genresStatus === "success" && genres?.map((genre: Genre) => (
                                <MenuItem
                                    key={genre.genreId}
                                    value={genre.genreId}
                                >
                                    {genre.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid display="flex">
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="multiple-age-rating-label">Age Rating</InputLabel>
                        <Select
                            labelId="multiple-genre-label"
                            id="multiple-genre"
                            multiple
                            value={filterAgeRatings}
                            onChange={filterAgeRating}
                            input={<OutlinedInput label="AgeRating" />}
                            MenuProps={MenuProps}
                        >
                            {ageRatings.map((ageRating) => (
                                <MenuItem
                                    key={ageRating}
                                    value={ageRating}
                                >
                                    {ageRating}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid display="flex">
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="select-sort-label">Sort</InputLabel>
                    <Select
                        labelId="select-sort-label"
                        id="select-sort"
                        value={sort}
                        label="Sort"
                        onChange={filterSort}
                    >
                        <MenuItem value={"RELEASED_ASC"}>Release Date Ascending</MenuItem>
                        <MenuItem value={"RELEASED_DESC"}>Release Date Descending</MenuItem>
                        <MenuItem value={"ALPHABETICAL_ASC"}>Alphabetically Ascending</MenuItem>
                        <MenuItem value={"ALPHABETICAL_DESC"}>Alphabetically Descending</MenuItem>
                        <MenuItem value={"RATING ASC"}>Rating Ascending</MenuItem>
                        <MenuItem value={"RATING_DESC"}>Rating Descending</MenuItem>
                    </Select>
                </FormControl>
                </Grid>
            </Grid>
            <Grid container xs={12} spacing={6} display="flex" justifyContent="center"  alignItems="center" disableEqualOverflow>
                { filmsStatus === "loading" && <CircularProgress />}
                { filmsStatus === "error" && <p>{filmError()}</p>}
                { genresStatus === "error" && <p>{genreError()}</p>}
                { filmsStatus === "success" && data.films?.slice((page - 1) * FILMS_PER_PAGE, page * FILMS_PER_PAGE).map((film: Film) => (<Grid key={film.filmId}><FilmListObject film={film} getGenre={getGenre} convertToDate={convertToDate}/></Grid>))}
            </Grid>
            <Grid xs={12} sx={{mt:3}} display="flex" justifyContent="center" alignItems="center">
                { filmsStatus === "success" && <Pagination count={Math.ceil(data.count/FILMS_PER_PAGE)} page={page} onChange={handlePageChange} />}
            </Grid>
        </Grid>
    )
}

export default FilmList;
