import Grid from "@mui/material/Unstable_Grid2";
import React, {useState} from "react";
import Button from "@mui/material/Button";
import EditNoteIcon from '@mui/icons-material/EditNote';
import {useUserStore} from "../store";
import CardMedia from "@mui/material/CardMedia";
import {useQuery} from "react-query";
import {getUser} from "../api/usersApi";
import {CircularProgress, Pagination, Paper, Stack, Tab, Tabs, Typography} from "@mui/material";
import {AxiosError} from "axios";
import TabPanel from "./TabPanel";
import {useWindowSize} from "../hooks/useWindowSize";
import {getFilmsParametrised, getGenres} from "../api/filmsApi";
import SimilarFilmObject from "./SimilarFilmObject";

const Profile = () => {
    const currentUserId = useUserStore(state => state.userId)
    const currentUserToken = useUserStore(state => state.authToken)
    const [userAxiosError, setUserAxiosError] = useState("")
    const { data: user, status: userStatus} = useQuery('profile', () => getUser(currentUserId, currentUserToken), {
        onError: (error: AxiosError) => {
            setUserAxiosError(error.response?.statusText || "Axios Error: Unknown")
        },
    })

    const [genresAxiosError, setGenresAxiosError] = useState("")
    const { data: genres, status: genresStatus } = useQuery('genres', getGenres, {
        onError: (error: AxiosError) => {
            setGenresAxiosError(error.response?.statusText || "Axios Error: Unknown")
        },
    })

    const [directedFilmsAxiosError, setDirectedFilmsAxiosError] = useState("")
    const { data: directedFilms, status: directedFilmsStatus} = useQuery('directedFilms', () => getFilmsParametrised("", [], [], "RELEASED_ASC", currentUserId.toString(), ""), {
        select: (data) => data.films,
        onError: (error: AxiosError) => {
            setDirectedFilmsAxiosError(error.response?.statusText || "Axios Error: Unknown")
        },
    })

    const [reviewedFilmsAxiosError, setReviewedFilmsAxiosError] = useState("")
    const { data: reviewedFilms, status: reviewedFilmsStatus} = useQuery('reviewedFilms', () => getFilmsParametrised("", [], [], "RELEASED_ASC", "", currentUserId.toString()), {
        select: (data) => data.films,
        onError: (error: AxiosError) => {
            setReviewedFilmsAxiosError(error.response?.statusText || "Axios Error: Unknown")
        },
    })

    const [directedFilmsPage, setDirectedFilmsPage] = useState(1);
    const [reviewedFilmsPage, setReviewedFilmsPage] = useState(1);
    const [tab, setTab] = React.useState(1);
    const [imageError, setImageError] = useState(false);
    const defaultImage = "http://localhost:4941/api/v1/users/" + currentUserId + "/image";
    const filmsPerPage = useWindowSize();
    const handleImageError = () => {
        setImageError(true);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    if (userStatus === "loading" || genresStatus === "loading" || directedFilmsStatus === "loading" || reviewedFilmsStatus === "loading") {
        return <Grid container mt={8} justifyContent="center"><CircularProgress/></Grid>
    }

    if (userAxiosError !== "") {
        return <Grid container mt={8} justifyContent="center"><Typography variant="h4">{"Error retrieving user: " + userAxiosError}</Typography></Grid>
    }

    if (genresAxiosError !== "") {
        return <Grid container mt={8} justifyContent="center"><Typography variant="h4">{"Error retrieving genres: " + genresAxiosError}</Typography></Grid>
    }

    if (directedFilmsAxiosError !== "") {
        return <Grid container mt={8} justifyContent="center"><Typography variant="h4">{"Error retrieving directed films: " + directedFilmsAxiosError}</Typography></Grid>
    }

    if (reviewedFilmsAxiosError !== "") {
        return <Grid container mt={8} justifyContent="center"><Typography variant="h4">{"Error retrieving reviewed films: " + reviewedFilmsAxiosError}</Typography></Grid>
    }

    const pageCountDirectedFilms = Math.ceil(directedFilms.length / filmsPerPage)

    const directed_film_rows = () => {
        if (directedFilmsPage > pageCountDirectedFilms) { setDirectedFilmsPage((page) => page-1) }
        return directedFilms.slice((directedFilmsPage - 1) * filmsPerPage, directedFilmsPage * filmsPerPage).map((film: Film) => <SimilarFilmObject key={film.filmId} film={film} getGenre={getGenre} convertToDate={convertToDate}/>)
    }

    const handleDirectorPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setDirectedFilmsPage(value);
    }

    const pageCountReviewedFilms = Math.ceil(reviewedFilms.length / filmsPerPage)

    const reviewed_film_rows = () => {
        if (reviewedFilmsPage > pageCountReviewedFilms) { setReviewedFilmsPage((page) => page-1) }
        return reviewedFilms.slice((reviewedFilmsPage - 1) * filmsPerPage, reviewedFilmsPage * filmsPerPage).map((film: Film) => <SimilarFilmObject key={film.filmId} film={film} getGenre={getGenre} convertToDate={convertToDate}/>)
    }

    const handleReviewPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setReviewedFilmsPage(value);
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

    return(
        <Paper elevation={3} sx={{m:6, ml:10, mr:10}}>
        <Grid container >
                <Grid xs={12} md={6} sx={{p:2}}>
                    <CardMedia
                        component="img"
                        height="500"
                        src={imageError ? defaultImage : "defaultProfilePic.png"}
                        alt="User Profile Picture"
                        onError={handleImageError}
                        sx={{ objectFit: "fill" }}
                    />
                </Grid>
                <Grid container direction="column" p={3} xs={12} md={6}>
                    <Grid xs={12}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Tabs
                                centered
                                value={tab}
                                onChange={handleTabChange}
                                textColor="secondary"
                                indicatorColor="secondary"
                            >
                                <Tab value={1} label="Overview" />
                                <Tab value={2} label="Directed Films" />
                                <Tab value={3} label="Reviewed Films" />
                            </Tabs>
                        </Stack>
                    </Grid>
                    <Grid xs={12} mt={4}>
                        <TabPanel value={tab} index={1}>
                            <Grid container xs={12} justifyContent="center" overflow="auto">
                                <Typography variant="h4">{user.firstName + " " + user.lastName}</Typography>
                            </Grid>
                            <Grid container xs={12} justifyContent="center" overflow="auto">
                                <Typography variant="h4">{user.email}</Typography>
                            </Grid>
                            <Grid container xs={12} mt={20} justifyContent="end">
                                <Grid>
                                    <Button variant="outlined" endIcon={<EditNoteIcon />}>
                                        Edit
                                    </Button>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={tab} index={2}>
                            <Grid container spacing={2} >
                                <Grid xs={12} container justifyContent="center">
                                    {directedFilms.length === 0 && <Typography m={3} variant="body1">No directed films to show</Typography>}
                                    {directed_film_rows()}
                                </Grid>
                                {directedFilms.length > 0 && <Grid xs={12} container justifyContent="center"><Pagination count={pageCountDirectedFilms} page={directedFilmsPage} onChange={handleDirectorPageChange}/></Grid>}
                            </Grid>
                        </TabPanel>
                        <TabPanel value={tab} index={3}>
                            <Grid container spacing={2} >
                                <Grid xs={12} container justifyContent="center">
                                    {reviewedFilms.length === 0 && <Typography m={3} variant="body1">No reviewed films to show</Typography>}
                                    {reviewed_film_rows()}
                                </Grid>
                                {reviewedFilms.length > 0 && <Grid xs={12} container justifyContent="center"><Pagination count={pageCountReviewedFilms} page={reviewedFilmsPage} onChange={handleReviewPageChange}/></Grid>}
                            </Grid>
                        </TabPanel>
                    </Grid>
                </Grid>
        </Grid>
        </Paper>

    )
}

export default Profile;