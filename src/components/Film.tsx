import axios, {AxiosError} from 'axios';
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {
    Alert,
    AlertTitle,
    Avatar,
    Chip,
    CircularProgress, Pagination,
    Paper,
    Rating,
    Stack,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import ReviewObject from "./ReviewObject";
import SimilarFilmObject from"./SimilarFilmObject"

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function useWindowSize() {
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

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Film = () => {
    const { id } = useParams<{ id: string }>();
    const [film, setFilm] = React.useState <Film>()
    const [similarFilms, setSimilarFilms] = React.useState <Film[]>([])
    const [genres, setGenres] = React.useState <Genre[]> ([])
    const [reviews, setReviews] = React.useState <Review[]> ([])
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [tab, setTab] = React.useState(1);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const similarFilmsPerPage = useWindowSize();
    const pageCount = Math.ceil(similarFilms.length / similarFilmsPerPage)


    React.useEffect(() => {
        void fetchData()
        getGenres()
        getReviews()
    }, [id])


    async function fetchData() {
        try {
            const response1 = await axios.get('http://localhost:4941/api/v1/films/' + id)
            setFilm(response1.data)

            const response2 = await axios.get('http://localhost:4941/api/v1/films/', {params: {genreIds: response1.data["genreId"]}})
            const response3 = await axios.get('http://localhost:4941/api/v1/films/', {params: {directorId: parseInt(response1.data["directorId"])}})
            const filmsByGenreId: Film[] = response2.data.films
            const filmsByDirectorId: Film[] = response3.data.films

            const similarFilmsIds: number[] = [parseInt(id as string)]
            const similarFilms: Film[] = []

            for (let i = 0; i < filmsByGenreId.length; i++) {
                if (!similarFilmsIds.includes(filmsByGenreId[i].filmId)) {
                    similarFilms.push(filmsByGenreId[i])
                    similarFilmsIds.push(filmsByGenreId[i].filmId)
                }
            }
            for (let i = 0; i < filmsByDirectorId.length; i++) {
                if (!similarFilmsIds.includes(filmsByDirectorId[i].filmId)) {
                    similarFilms.push(filmsByDirectorId[i])
                    similarFilmsIds.push(filmsByDirectorId[i].filmId)
                }
            }
            setSimilarFilms(similarFilms)
        } catch(err) {
            const errors = err as Error | AxiosError
            setErrorFlag(true)
            setErrorMessage(errors.toString())
        } finally {
            setIsLoading(false)
        }
    }

    const getGenres = () => {
        console.log("Getting Genres")
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

    const getReviews = () => {
        console.log("Getting Reviews")
        axios.get('http://localhost:4941/api/v1/films/' + id + '/reviews')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setReviews(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const review_rows = () => reviews.map((review: Review) => <ReviewObject key={review.reviewerId + review.timestamp} review={review}/>)
    const similar_film_rows = () => {
        console.log(page, pageCount)
        if (isLoading) {
            return <CircularProgress />
        }
        if (page > pageCount) { setPage((page) => page-1) }
        return similarFilms.slice((page - 1) * similarFilmsPerPage, page * similarFilmsPerPage).map((film: Film) => <SimilarFilmObject key={film.filmId} film={film} genres={genres}/>)
    }

    function getGenre(genreId: number): string {
        for (const Genre of genres) {
            if (Genre.genreId === genreId) { return Genre.name}
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

    if (!film) {
        return(
            <Grid container >
                <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                </Grid>
            </Grid>
        )
    } else {
        return (
            <Grid container display="flex" justifyContent="center"  alignItems="center">
                <Grid xs={12} sx={{m:6, ml:10, mr:10}}>
                    {errorFlag?
                        <Alert severity="error">
                            <AlertTitle> Error </AlertTitle>
                            { errorMessage }
                        </Alert>: ""}
                    <Paper elevation={3}>
                        <Grid container >
                            <Grid sm={12} md={6} sx={{p:2}}>
                                <CardMedia
                                    component="img"
                                    height="500"
                                    src={"http://localhost:4941/api/v1/films/" + film.filmId +"/image"}
                                    alt="Film Hero Image"
                                    sx={{ objectFit: "fill" }}
                                />
                            </Grid>
                            <Grid container display="flex" direction="column" rowSpacing={2} sm={12} md={6} sx={{p:2}}>
                                <Grid xs={12} sx={{borderBottom:1}}>
                                    <Typography variant="h4">{film.title}</Typography>
                                    <Typography variant="subtitle2">{convertToDate(film.releaseDate)}</Typography>
                                </Grid>
                                <Grid xs={12}>
                                    <Tabs
                                        value={tab}
                                        onChange={handleTabChange}

                                        textColor="secondary"
                                        indicatorColor="secondary"
                                    >
                                        <Tab value={1} label="Overview" />
                                        <Tab value={2} label="Reviews" />
                                        <Tab value={3} label="Similar Films" />
                                    </Tabs>
                                </Grid>
                                <TabPanel value={tab} index={1}>
                                    <Grid container direction="column" sx={{p:1}} rowSpacing={2}>
                                        <Grid xs={12} container>
                                            <Grid>
                                                <Stack spacing={1} direction="row" alignItems="center">
                                                    <Chip label={getGenre(film.genreId)} variant="outlined" />
                                                    <Rating max={10} name="half-rating-read" defaultValue={film.rating} precision={0.5} readOnly />
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                        <Grid xs={12}>
                                            <Typography variant="body1">{film.description}</Typography>
                                        </Grid>
                                        <Grid xs={12} sx={{p:0}} display="flex" alignItems="center" justifyContent="end">
                                            <Grid sx={{mr:2}}>
                                                <Typography variant="body1">{film.directorFirstName + " " + film.directorLastName}</Typography>
                                            </Grid>
                                            <Grid>
                                                <Avatar alt="Director Profile Pic" src={"http://localhost:4941/api/v1/users/" + film.directorId +"/image"} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                                <TabPanel value={tab} index={2}>
                                    <Grid container direction="column" spacing={1} sx={{flexWrap:"nowrap", overflow:"auto", maxHeight:400}}>
                                        {review_rows()}
                                    </Grid>
                                </TabPanel>
                                <TabPanel value={tab} index={3}>
                                    <Grid container spacing={2} >
                                        <Grid xs={12} container justifyContent="center">
                                            {similar_film_rows()}
                                        </Grid>
                                        <Grid xs={12} container justifyContent="center">
                                            <Pagination count={pageCount} page={page} onChange={handlePageChange}  />
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default Film;