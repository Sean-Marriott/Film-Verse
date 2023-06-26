import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import MovieIcon from '@mui/icons-material/Movie';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {
    Alert, CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    SelectChangeEvent, Stack
} from "@mui/material";
import {useQuery} from "react-query";
import MenuItem from "@mui/material/MenuItem";
import {MobileDateTimePicker, TimeField} from "@mui/x-date-pickers";
import {getGenres} from "../api/filmsApi";
import {Dayjs} from "dayjs";

interface IAddFilmForm {
    setFilmData: (formData: FormData) => void;
    handleNext: () => void;
    axiosError: string;
}
const AddFilmForm = (props: IAddFilmForm) => {
    const [filmTitle, setFilmTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [genre, setGenre] = React.useState("")
    const [ageRating, setAgeRating] = React.useState("TBC")
    const [releaseDate, setReleaseDate] = React.useState<Dayjs | null>(null)
    const [runtime, setRuntime] = React.useState<Dayjs | null>(null)
    const [filmTitleError, setFilmTitleError] = React.useState(false)
    const [descriptionError, setDescriptionError] = React.useState(false)
    const [genreError, setGenreError] = React.useState(false)
    const [ageRatingError, setAgeRatingError] = React.useState(false)
    const [axiosError, setAxiosError] = React.useState(props.axiosError)

    const {data:genres, status:genresStatus, error:genresError} = useQuery("genres", getGenres)

    const ageRatings = [
        "G",
        "PG",
        "M",
        "R13",
        "R16",
        "R18",
        "TBC"
    ]

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAxiosError("")
        const formData = new FormData(event.currentTarget)
        if (validateData()) {
            const releaseDateAsIsoString = releaseDate?.format('YYYY-MM-DD HH:mm:ss')
            if (releaseDateAsIsoString) {
                formData.set("releaseDate", releaseDateAsIsoString)
                console.log(formData.get("releaseDate"))
            }
            const hours = runtime?.hour() || 0
            const minutes = runtime?.minute() || 0
            const totalTime = (hours * 60) + minutes
            if (totalTime > 0) {formData.set("runtime", totalTime.toString())}
            props.setFilmData(formData)
            props.handleNext()
        }
    };

    function validateData() {
        let valid = true
        setFilmTitleError(false)
        setDescriptionError(false)
        setGenreError(false)
        setAgeRatingError(false)

        if (filmTitle === "") {
            setFilmTitleError(true)
            valid = false
        }

        if (description === "") {
            setDescriptionError(true)
            valid = false
        }

        if (genre === "" || !genres.map((genre: Genre) => genre.genreId).includes(genre)) {
            setGenreError(true)
            valid = false
        }

        if (!ageRatings.includes(ageRating)) {
            setAgeRatingError(true)
            valid=false
        }

        return valid
    }

    const handleChangeGenre = (event: SelectChangeEvent) => {
        setGenre(event.target.value as string);
    };

    const handleChangeAgeRating = (event: SelectChangeEvent) => {
        setAgeRating(event.target.value as string);
    };

    if (genresStatus === "loading") {
        return(
            <Box m={6}><CircularProgress/></Box>
        )
    }

    if (genresStatus === "error") {
        return(
            <Box m={6}><Typography variant="h4" color="error">{"Unable to get genres: " + genresError}</Typography></Box>
        )
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Stack direction="row" alignItems="baseline">
                    <Typography component="h1" variant="h5">
                        Add Film
                    </Typography>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <MovieIcon />
                    </Avatar>
                </Stack>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="filmTitle"
                                onChange={(e) => setFilmTitle(e.target.value)}
                                error={filmTitleError}
                                helperText={filmTitleError ? "Please enter a film title" : ""}
                                required
                                fullWidth
                                id="filmTitle"
                                label="Film Title"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                multiline
                                rows={3}
                                fullWidth
                                id="description"
                                label="Description"
                                name="description"
                                onChange={(e) => setDescription(e.target.value)}
                                error={descriptionError}
                                helperText={descriptionError ? "Please enter a description" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="genre-label">Genre *</InputLabel>
                                <Select
                                    name="genre"
                                    labelId="genre-label"
                                    id="genre"
                                    error={genreError}
                                    value={genre}
                                    label="Genre *"
                                    onChange={handleChangeGenre}
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
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="ageRating-label">Age Rating</InputLabel>
                                <Select
                                    name="ageRating"
                                    labelId="ageRating-label"
                                    id="ageRating"
                                    error={ageRatingError}
                                    value={ageRating}
                                    label="Age Rating"
                                    onChange={handleChangeAgeRating}
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
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <MobileDateTimePicker
                                    disablePast
                                    format='DD-MM-YYYY HH:mm:ss'
                                    slotProps={{textField: {name: "releaseDate", id:"releaseDate"}}}
                                    label="Release Date"
                                    value={releaseDate}
                                    onChange={(newValue) => setReleaseDate(newValue)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <TimeField
                                    name="runtime"
                                    id="runtime"
                                    label="Runtime"
                                    value={runtime}
                                    onChange={(newValue) => setRuntime(newValue)}
                                    format="HH:mm"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Next
                    </Button>
                    {axiosError !== "" && <Grid item><Typography component="h1" variant="h5"><Alert severity="error">{axiosError}</Alert></Typography></Grid>}
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default AddFilmForm;