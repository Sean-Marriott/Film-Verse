import {AxiosError} from 'axios';
import {useParams} from "react-router-dom";
import React, {ChangeEvent, useState} from "react";
import {
    Alert,
    Avatar,
    Chip,
    CircularProgress, FormControl, FormHelperText, InputAdornment, InputLabel, Modal, OutlinedInput, Pagination,
    Paper,
    Rating, Select, SelectChangeEvent,
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
import {addReview, getFilm, getFilmsParametrised, getGenres, getReviews, updateFilm} from "../api/filmsApi";
import AddCommentIcon from '@mui/icons-material/AddComment';
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SendIcon from '@mui/icons-material/Send';
import Button from "@mui/material/Button";
import {useUserStore} from "../store";
import TabPanel from "./TabPanel";
import {useWindowSize} from "../hooks/useWindowSize"
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditIcon from "@mui/icons-material/Edit";
import MenuItem from "@mui/material/MenuItem";
import {MobileDateTimePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import Card from "@mui/material/Card";

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

interface FormData {
    title: string,
    description: string,
    genre: string,
    ageRating: string,
    releaseDate: Dayjs,
    runtime: string
}

const initialFormData: FormData = {
    title: '',
    description: '',
    genre: '',
    ageRating: '',
    releaseDate: dayjs(),
    runtime: ''
}

const Film = () => {
    const loggedInUserId = useUserStore(state => state.userId)
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [titleError, setTitleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [genreError, setGenreError] = useState(false)
    const [ageRatingError, setAgeRatingError] = useState(false)
    const [runtimeError, setRuntimeError] = useState(false)

    const [axiosError, setAxiosError] = useState("")
    const { id } = useParams<{ id: string }>();

    const [imageError, setImageError] = useState(false);
    const handleImageError = () => {
        console.log("Image Error: Resulting to default image")
        setImageError(true);
    };

    const [tab, setTab] = React.useState(1);
    const [page, setPage] = useState(1);
    const similarFilmsPerPage = useWindowSize();
    const [openReviewModal, setOpenReviewModal] = React.useState(false);
    const [openEditModal, setOpenEditModal] = React.useState(false);
    const { data: genres, status: genresStatus, error: genresError } = useQuery('genres', getGenres)
    const { data: film, status: filmStatus, error: filmError  } = useQuery(['film', id], () => getFilm(id? id:"-1"), {
        onSuccess: (data) => {
            const preExistingData: FormData = {
                title: data.title,
                description: data.description,
                genre: data.genreId,
                ageRating: data.ageRating,
                releaseDate: dayjs(data.releaseDate),
                runtime: data.runtime||""
            }
            setFormData(preExistingData)
        }, enabled: !!genres
    })
    const { data: reviews, status: reviewStatus, error: reviewError } = useQuery(['reviews', id], () => getReviews(id? id:"-1"))
    const { data: similarFilmGenreId, status: similarFilmGenreIdStatus, error:similarFilmGenreIdError } = useQuery(['similarFilmGenreId', id], () => getFilmsParametrised("", film.genreId, [], "RELEASED_ASC", "", ""), {
        select: (data) => data.films,
        enabled: !!film})
    const { data: similarFilmDirectorId, status: similarFilmDirectorIdStatus, error:similarFilmDirectorIdError } = useQuery(['similarFilmDirectorId', id], () => getFilmsParametrised("", [], [], "RELEASED_ASC", film.directorId, ""), {
        select: (data) => data.films,
        enabled: !!film})

    const addReviewMutation  = useMutation(addReview, {
        onSuccess: () => {
            console.log("SUCCESS")
            void queryClient.invalidateQueries({ queryKey: ['reviews'] })
            setOpenReviewModal(false)
        },
        onError: (error: AxiosError) => {
            setAxiosError(error.response?.statusText || "Axios Error: Unknown")
        },
    })

    const [updateFilmAxiosError, setUpdateFilmAxiosError] = useState("")
    const updateFilmMutation  = useMutation(updateFilm, {
        onSuccess: () => {
            console.log("SUCCESS")
            void queryClient.invalidateQueries({ queryKey: ['film'] })
            setOpenEditModal(false)
        },
        onError: (error: AxiosError) => {
            setUpdateFilmAxiosError(error.response?.statusText || "Axios Error: Unknown")
        },
    })

    const ageRatings = [
        "G",
        "PG",
        "M",
        "R13",
        "R16",
        "R18",
        "TBC"
    ]

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

    const handleOpenReviewModal = () => setOpenReviewModal(true);
    const handleCloseReviewModal = () => setOpenReviewModal(false);

    const handleOpenEditModal = () => setOpenEditModal(true);
    const handleCloseEditModal = () => setOpenEditModal(false);

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

    const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateFilmAxiosError("")
        if (validateData() && id) {
            const formData = new FormData(event.currentTarget)
            formData.set("filmId", id)
            updateFilmMutation.mutate(formData)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>):void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeSelectBox = (event: SelectChangeEvent) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    };

    function validateData() {
        let valid = true
        setTitleError(false)
        setDescriptionError(false)
        setGenreError(false)
        setAgeRatingError(false)
        setRuntimeError(false)

        const runtimeRegex = /^(\d+)$/;

        if (formData.title === "") {
            setTitleError(true)
            valid = false
        }

        if (formData.description === "") {
            setDescriptionError(true)
            valid = false
        }

        if (formData.genre === "" || !genres.map((genre: Genre) => genre.genreId).includes(formData.genre)) {
            setGenreError(true)
            valid = false
        }

        if (!ageRatings.includes(formData.ageRating)) {
            setAgeRatingError(true)
            valid=false
        }

        if (formData.runtime !== "" && (!runtimeRegex.test(formData.runtime) || parseInt(formData.runtime) < 0 || parseInt(formData.runtime) > 300)) {
            setRuntimeError(true)
            valid=false
        }

        return valid
    }

    return (
        <Grid container display="flex" justifyContent="center"  alignItems="center">
            <Grid xs={12} sx={{m:6, ml:10, mr:10}}>
                <Paper elevation={3}>
                    <Grid container >
                        <Grid sm={12} md={6} sx={{p:2}}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="500"
                                    src={imageError ? "/defaultFilmImage.png" : "http://localhost:4941/api/v1/films/" + id + "/image"}
                                    onError={handleImageError}
                                    alt="Film Hero Image"
                                    sx={{ objectFit: "fill" }}
                                />
                            </Card>
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
                                    {tab === 2 && <IconButton aria-label="addReview" size="small" onClick={handleOpenReviewModal}><AddCommentIcon color="secondary"/></IconButton>}
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
                                    {loggedInUserId === film.directorId &&
                                        <Grid container spacing={2} xs={12} mt={12} justifyContent="end">
                                            <Grid>
                                                <Button variant="outlined" endIcon={<AddAPhotoIcon />} href={"/updateFilmImage/" + id}>
                                                    Update Hero Image
                                                </Button>
                                            </Grid>
                                            <Grid>
                                                <Button variant="outlined" endIcon={<EditNoteIcon />} onClick={handleOpenEditModal}>
                                                    Edit
                                                </Button>
                                            </Grid>
                                        </Grid>}
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
                open={openReviewModal}
                onClose={handleCloseReviewModal}
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
            <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box component="form" onSubmit={handleEditSubmit} sx={style}>
                    <Grid container spacing={2}>
                        <Grid xs={12}>
                            <Typography variant="h6">Edit Film: </Typography>
                        </Grid>
                        <Grid container>
                            <Grid xs={12}>
                                <TextField
                                    id="title"
                                    label="Title"
                                    variant="outlined"
                                    name="title"
                                    fullWidth
                                    required
                                    error={titleError}
                                    helperText={titleError ? "Please enter a title" : ""}
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    id="description"
                                    label="Description"
                                    variant="outlined"
                                    name="description"
                                    fullWidth
                                    required
                                    error={descriptionError}
                                    helperText={descriptionError ? "Please enter a description" : ""}
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="genre-label">Genre *</InputLabel>
                                    <Select
                                        name="genre"
                                        labelId="genre-label"
                                        id="genre"
                                        label="Genre *"
                                        error={genreError}
                                        value={formData.genre}
                                        onChange={handleChangeSelectBox}
                                    >
                                        {genresStatus === "success" && genres.map((genre: Genre) => (
                                            <MenuItem
                                                key={genre.genreId}
                                                value={genre.genreId}
                                            >
                                                {genre.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {genreError && (
                                        <FormHelperText error id="genre-error">
                                            Please select a genre
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="ageRating-label">Age Rating</InputLabel>
                                    <Select
                                        name="ageRating"
                                        labelId="ageRating-label"
                                        id="ageRating"
                                        label="Age Rating"
                                        error={ageRatingError}
                                        value={formData.ageRating}
                                        onChange={handleChangeSelectBox}
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
                                    {ageRatingError && (
                                        <FormHelperText error id="ageRating-error">
                                            Please select a valid age rating
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <MobileDateTimePicker
                                        disablePast={!dayjs().isAfter(formData.releaseDate)}
                                        disabled={dayjs().isAfter(formData.releaseDate)}
                                        format='YYYY-MM-DD HH:mm:ss'
                                        slotProps={{textField: {name: "releaseDate", id:"releaseDate"}}}
                                        label="Release Date"
                                        value={formData.releaseDate}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <FormControl sx={{ width: '100%' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-runtime">Runtime</InputLabel>
                                    <OutlinedInput
                                        name="runtime"
                                        id="outlined-adornment-runtime"
                                        error={runtimeError}
                                        value={formData.runtime}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                minutes
                                            </InputAdornment>
                                        }
                                        label="Runtime"
                                    />
                                    {runtimeError && (
                                        <FormHelperText error id="outlined-adornment-runtime-error">
                                            Please enter a valid runtime in minutes (no more than 300 minutes)
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid xs={12} container justifyContent='flex-end'>
                            {updateFilmAxiosError !== "" && <Alert sx={{mr: 3}} severity="error">{updateFilmAxiosError}</Alert>}
                            <IconButton aria-label="edit" size="small" type="submit"><EditIcon color="secondary"/></IconButton>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Grid>
    )

}

export default Film;