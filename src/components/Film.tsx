import {AxiosError} from 'axios';
import {useParams} from "react-router-dom";
import React, {useState} from "react";
import {
    Alert,
    Avatar,
    Chip,
    CircularProgress, Modal, Pagination,
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
import {useMutation, useQuery, useQueryClient} from "react-query";
import {addReview, getFilm, getFilmsParametrised, getGenres, getReviews} from "../api/filmsApi";
import AddCommentIcon from '@mui/icons-material/AddComment';
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SendIcon from '@mui/icons-material/Send';
import Button from "@mui/material/Button";
import {useUserStore} from "../store";
import TabPanel from "./TabPanel";
import {useWindowSize} from "../hooks/useWindowSize"

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '25px',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Film = () => {
    const loggedInUserId = useUserStore(state => state.userId)
    const loggedInUserToken= useUserStore(state => state.authToken)
    const queryClient = useQueryClient()
    const [axiosError, setAxiosError] = useState("")
    const { id } = useParams<{ id: string }>();
    const [tab, setTab] = React.useState(1);
    const [page, setPage] = useState(1);
    const similarFilmsPerPage = useWindowSize();
    const [openModal, setOpenModal] = React.useState(false);
    const { data: genres, status: genresStatus, error: genresError } = useQuery('genres', getGenres)
    const { data: film, status: filmStatus, error: filmError  } = useQuery(['film', id], () => getFilm(id? id:"-1"))
    const { data: reviews, status: reviewStatus, error: reviewError } = useQuery(['reviews', id], () => getReviews(id? id:"-1"))
    const { data: similarFilmGenreId, status: similarFilmGenreIdStatus, error:similarFilmGenreIdError } = useQuery(['similarFilmGenreId', id], () => getFilmsParametrised("", film.genreId, [], "RELEASED_ASC", "", ""), {
        select: (data) => data.films,
        enabled: !!film})
    const { data: similarFilmDirectorId, status: similarFilmDirectorIdStatus, error:similarFilmDirectorIdError } = useQuery(['similarFilmDirectorId', id], () => getFilmsParametrised("", [], [], "RELEASED_ASC", film.directorId, ""), {
        select: (data) => data.films,
        enabled: !!film})

    console.log(loggedInUserId)
    console.log(loggedInUserToken)

    const addReviewMutation  = useMutation(addReview, {
        onSuccess: () => {
            console.log("SUCCESS")
            void queryClient.invalidateQueries({ queryKey: ['reviews'] })
            setOpenModal(false)
            // navigate('/films')

        },
        onError: (error: AxiosError) => {
            setAxiosError(error.response?.statusText || "Axios Error: Unknown")
        },
    })

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

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const review_rows = () => reviews.map((review: Review) => <ReviewObject key={review.reviewerId + review.timestamp} review={review}/>)
    const similar_film_rows = () => {
        if (page > pageCount) { setPage((page) => page-1) }
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

    const handleReviewSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (id) {
            event.preventDefault();
            const formData = new FormData(event.currentTarget)
            formData.set("filmId", id)
            addReviewMutation.mutate(formData)
        }
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
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
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
                                    {tab === 2 && <IconButton aria-label="addReview" size="small" onClick={handleOpenModal}><AddCommentIcon color="secondary"/></IconButton>}
                                </Stack>
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
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box component="form" onSubmit={handleReviewSubmit} sx={style}>
                    <Grid container spacing={2}>
                        <Grid xs={12}>
                            <Typography variant="h6">Add Review: </Typography>
                        </Grid>
                        {loggedInUserId !== -1 && <Grid container>
                            <Grid xs={12}>
                                <Rating name="reviewRating" precision={0.5} max={10}/>
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    name="reviewText"
                                    id="outlined-multiline-static"
                                    multiline
                                    rows={4}
                                    placeholder="Wow, what an amazing movie!!"
                                />
                            </Grid>
                            <Grid xs={12} container justifyContent='flex-end'>
                                {axiosError !== "" && <Alert sx={{mr: 3}} severity="error">{axiosError}</Alert>}
                                <IconButton aria-label="addReview" size="small" type="submit"><SendIcon color="secondary"/></IconButton>
                            </Grid>
                        </Grid>}
                        {loggedInUserId === -1 && <Grid container>
                            <Grid>
                                <Typography variant="subtitle2">You must be logged in to place a review</Typography>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid>
                                    <Button variant="outlined" href="/signup">Signup</Button>
                                </Grid>
                                <Grid>
                                    <Button variant="outlined" href="/login">Login</Button>
                                </Grid>
                            </Grid>
                        </Grid>}
                    </Grid>
                </Box>
            </Modal>
        </Grid>
    )

}

export default Film;