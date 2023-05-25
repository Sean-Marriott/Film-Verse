import Grid from "@mui/material/Unstable_Grid2";
import React, {ChangeEvent, FormEvent, useState} from "react";
import Button from "@mui/material/Button";
import EditNoteIcon from '@mui/icons-material/EditNote';
import {useUserStore} from "../store";
import CardMedia from "@mui/material/CardMedia";
import {useQuery} from "react-query";
import {getUser} from "../api/usersApi";
import {
    CircularProgress, FormControl, InputAdornment,
    InputLabel,
    Modal, OutlinedInput,
    Pagination,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import {AxiosError} from "axios";
import TabPanel from "./TabPanel";
import {useWindowSize} from "../hooks/useWindowSize";
import {getFilmsParametrised, getGenres} from "../api/filmsApi";
import SimilarFilmObject from "./SimilarFilmObject";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import {Visibility, VisibilityOff} from "@mui/icons-material";

interface FormData {
    firstName: string,
    lastName: string,
    email: string,
    currentPassword: string,
    newPassword: string
}

const initialFormData: FormData = {
    firstName: '',
    lastName: '',
    email:'',
    currentPassword:'',
    newPassword:''
}

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

const Profile = () => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [openModal, setOpenModal] = React.useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
    const handleClickShowCurrentPassword= () => setShowCurrentPassword((show) => !show);
    const handleMouseDownCurrentPassword = (event: React.MouseEvent<HTMLButtonElement>) => {event.preventDefault();};

    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const handleClickShowNewPassword= () => setShowNewPassword((show) => !show);
    const handleMouseDownNewPassword = (event: React.MouseEvent<HTMLButtonElement>) => {event.preventDefault();};
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const handleChange = (e: ChangeEvent<HTMLInputElement>):void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) : void => {
        e.preventDefault()
        let formData = new FormData(e.currentTarget)
        console.log(formData.get("firstName"))
        console.log(formData.get("lastName"))
        console.log(formData.get("email"))
        console.log(formData.get("currentPassword"))
        console.log(formData.get("newPassword"))
    }


    const currentUserId = useUserStore(state => state.userId)
    const currentUserToken = useUserStore(state => state.authToken)
    const [userAxiosError, setUserAxiosError] = useState("")
    const { data: user, status: userStatus} = useQuery('profile', () => getUser(currentUserId, currentUserToken), {
        onSuccess: (data) => {
          const preExistingData: FormData = {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              currentPassword: '',
              newPassword: ''

          }
          setFormData(preExistingData)
        },
        onError: (error: AxiosError) => {
            if (error.response) {setUserAxiosError("Unable to get user: " + error.response.statusText)}
            else {setUserAxiosError("Unable to get user: " + error.message)}
        },
    })

    const [genresAxiosError, setGenresAxiosError] = useState("")
    const { data: genres, status: genresStatus } = useQuery('genres', getGenres, {
        onError: (error: AxiosError) => {
            if (error.response) {setGenresAxiosError("Unable to get genres: " + error.response.statusText)}
            else {setGenresAxiosError("Unable to get genres: " + error.message)}
        },
    })

    const [directedFilmsAxiosError, setDirectedFilmsAxiosError] = useState("")
    const { data: directedFilms, status: directedFilmsStatus} = useQuery('directedFilms', () => getFilmsParametrised("", [], [], "RELEASED_ASC", currentUserId.toString(), ""), {
        select: (data) => data.films,
        onError: (error: AxiosError) => {
            if (error.response) {setDirectedFilmsAxiosError("Unable to get films by director: " + error.response.statusText)}
            else {setDirectedFilmsAxiosError("Unable to get films by director: " + error.message)}
        },
    })

    const [reviewedFilmsAxiosError, setReviewedFilmsAxiosError] = useState("")
    const { data: reviewedFilms, status: reviewedFilmsStatus} = useQuery('reviewedFilms', () => getFilmsParametrised("", [], [], "RELEASED_ASC", "", currentUserId.toString()), {
        select: (data) => data.films,
        onError: (error: AxiosError) => {
            if (error.response) {setReviewedFilmsAxiosError("Unable to get films by reviewer: " + error.response.statusText)}
            else {setReviewedFilmsAxiosError("Unable to get films by reviewer: " + error.message)}
        },
    })

    const [directedFilmsPage, setDirectedFilmsPage] = useState(1);
    const [reviewedFilmsPage, setReviewedFilmsPage] = useState(1);
    const [tab, setTab] = React.useState(1);
    const [imageError, setImageError] = useState(false);
    const defaultImage = "http://localhost:4941/api/v1/users/" + currentUserId + "/image";
    const filmsPerPage = useWindowSize();
    const handleImageError = () => {
        console.log("Image Error: Resulting to default image")
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
                        src={imageError ? "defaultProfilePic.png":defaultImage}
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
                                    <Button variant="outlined" endIcon={<EditNoteIcon />} onClick={handleOpenModal}>
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
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box component="form" onSubmit={handleSubmit} sx={style}>
                    <Grid container spacing={2}>
                        <Grid xs={12}>
                            <Typography variant="h6">Edit Profile: </Typography>
                        </Grid>
                        <Grid container>
                            <Grid xs={6}>
                                <TextField
                                    id="firstName"
                                    label="First Name"
                                    variant="outlined"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    id="lastName"
                                    label="Last Name"
                                    variant="outlined"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    variant="outlined"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <FormControl sx={{ width: '100%' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-current-password">Current Password  *</InputLabel>
                                    <OutlinedInput
                                        name="currentPassword"
                                        id="outlined-adornment-current-password"
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowCurrentPassword}
                                                    onMouseDown={handleMouseDownCurrentPassword}
                                                    edge="end"
                                                >
                                                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Current Password  *"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={12}>
                                <FormControl sx={{ width: '100%' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-new-password">New Password  *</InputLabel>
                                    <OutlinedInput
                                        name="newPassword"
                                        id="outlined-adornment-new-password"
                                        type={showNewPassword ? 'text' : 'password'}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowNewPassword}
                                                    onMouseDown={handleMouseDownNewPassword}
                                                    edge="end"
                                                >
                                                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="New Password  *"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={12} container justifyContent='flex-end'>
                                {/*{axiosError !== "" && <Alert sx={{mr: 3}} severity="error">{axiosError}</Alert>}*/}
                                <IconButton aria-label="addReview" size="small" type="submit"><EditIcon color="secondary"/></IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Paper>

    )
}

export default Profile;