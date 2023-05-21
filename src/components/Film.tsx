import axios from 'axios';
import {useParams} from "react-router-dom";
import React from "react";
import {
    Alert,
    AlertTitle,
    Avatar,
    Chip,
    CircularProgress,
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

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
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
    const [genres, setGenres] = React.useState <Genre[]> ([])
    const [reviews, setReviews] = React.useState <Review[]> ([])
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [tab, setTab] = React.useState(1);


    React.useEffect(() => {
        getFilm()
        getGenres()
        getReviews()
    }, [])

    const getFilm = () => {
        axios.get('http://localhost:4941/api/v1/films/' + id)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setFilm(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

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

    const getReviews = () => {
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

    const review_rows = () => reviews.map((review: Review) => <ReviewObject review={review}/>)

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

    console.log(reviews)


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
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default Film;