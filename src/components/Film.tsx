import {AxiosError} from 'axios';
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {
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
import {useQuery} from "react-query";
import {getFilm, getFilmsParametrised, getGenres, getReviews} from "../api/filmsApi";

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
    const [tab, setTab] = React.useState(1);
    const [page, setPage] = useState(1);
    const similarFilmsPerPage = useWindowSize();
    const { data: genres, status: genresStatus, error: genresError } = useQuery('genres', getGenres)
    const { data: film, status: filmStatus, error: filmError  } = useQuery(['film', id], () => getFilm(id? id:"-1"))
    const { data: reviews, status: reviewStatus, error: reviewError } = useQuery(['reviews', id], () => getReviews(id? id:"-1"))
    const { data: similarFilmGenreId, status: similarFilmGenreIdStatus, error:similarFilmGenreIdError } = useQuery(['similarFilmGenreId', id], () => getFilmsParametrised("", film.genreId, [], "RELEASED_ASC", ""), {
        select: (data) => data.films,
        enabled: !!film})
    const { data: similarFilmDirectorId, status: similarFilmDirectorIdStatus, error:similarFilmDirectorIdError } = useQuery(['similarFilmDirectorId', id], () => getFilmsParametrised("", [], [], "RELEASED_ASC", film.directorId), {
        select: (data) => data.films,
        enabled: !!film})

    if (genresStatus === "loading" || filmStatus === "loading" || reviewStatus === "loading" || similarFilmGenreIdStatus === "loading" || similarFilmDirectorIdStatus === "loading") {
        return <Grid container mt={8} justifyContent="center"><CircularProgress/></Grid>
    }

    if (filmStatus === "error") {
        const error = filmError as Error | AxiosError
        return <Grid container mt={8} justifyContent="center"><Typography variant="h4">{"Error retrieving films: " + error.message}</Typography></Grid>
    }

    if (genresStatus === "error") {
        const error = genresError as Error | AxiosError
        return <Grid container mt={8} justifyContent="center"><Typography variant="h4">{"Error retrieving genres: " + error.message}</Typography></Grid>
    }

    if (reviewStatus === "error") {
        const error = reviewError as Error | AxiosError
        return <Grid container mt={8} justifyContent="center"><Typography variant="h4">{"Error retrieving genres: " + error.message}</Typography></Grid>
    }

    if (similarFilmGenreIdStatus === "error") {
        const error = similarFilmGenreIdError as Error | AxiosError
        return <Grid container mt={8} justifyContent="center"><Typography variant="h4">{"Error retrieving genres: " + error.message}</Typography></Grid>
    }

    if (similarFilmDirectorIdStatus === "error") {
        const error = similarFilmDirectorIdError as Error | AxiosError
        return <Grid container mt={8} justifyContent="center"><Typography variant="h4">{"Error retrieving genres: " + error.message}</Typography></Grid>
    }

    const similarFilmIds: number[] = [parseInt(id as string)]
    const similarFilms: Film[] = []

    for (let i = 0; i < similarFilmGenreId.length; i++) {
        if(!similarFilmIds.includes(similarFilmGenreId[i].filmId)) {
            similarFilms.push(similarFilmGenreId[i])
            similarFilmIds.push(similarFilmGenreId[i].filmId)
        }
    }

    for (let i=0; i < similarFilmDirectorId.length; i++) {
        if(!similarFilmIds.includes(similarFilmDirectorId[i].filmId)) {
            similarFilms.push(similarFilmDirectorId[i])
            similarFilmIds.push(similarFilmDirectorId[i].filmId)
        }
    }

    const pageCount = Math.ceil(similarFilms.length / similarFilmsPerPage)

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const review_rows = () => reviews.map((review: Review) => <ReviewObject key={review.reviewerId + review.timestamp} review={review}/>)
    const similar_film_rows = () => {
        if (page > pageCount) { setPage((page) => page-1) }
        console.log(similarFilms.slice((page - 1) * similarFilmsPerPage, page * similarFilmsPerPage))
        return similarFilms.slice((page - 1) * similarFilmsPerPage, page * similarFilmsPerPage).map((film: Film) => <SimilarFilmObject key={film.filmId} film={film} getGenre={getGenre} convertToDate={convertToDate}/>)
    }

    function getGenre(genreId: number): string {
        if (genresStatus === "success") {
            for (const Genre of genres) {
                if (Genre.genreId === genreId) { return Genre.name}
            }
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

    return (
        <Grid container display="flex" justifyContent="center"  alignItems="center">
            <Grid xs={12} sx={{m:6, ml:10, mr:10}}>
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
                                    {reviews.length === 0 && <Typography m={3} variant="body1">No reviews to show</Typography>}
                                    {review_rows()}
                                </Grid>
                            </TabPanel>
                            <TabPanel value={tab} index={3}>
                                <Grid container spacing={2} >
                                    <Grid xs={12} container justifyContent="center">
                                        {similarFilms.length === 0 && <Typography m={3} variant="body1">No similar films to show</Typography>}
                                        {similar_film_rows()}
                                    </Grid>
                                    {similarFilms.length > 0 && <Grid xs={12} container justifyContent="center"><Pagination count={pageCount} page={page} onChange={handlePageChange}  /></Grid>}
                                </Grid>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )

}

export default Film;