import axios from 'axios';
import {useParams} from "react-router-dom";
import React from "react";
import {Alert, AlertTitle, CircularProgress, Tab, Tabs} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CardMedia from "@mui/material/CardMedia";

const Film = () => {
    const { id } = useParams<{ id: string }>();
    const [film, setFilm] = React.useState <Film> ()
    const [isLoading, setIsLoading] = React.useState(true)
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [tab, setTab] = React.useState('one');



    React.useEffect(() => {
        getFilm().then()
    }, [])

     const getFilm = async () => {
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

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };


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
                {errorFlag?
                    <Alert severity="error">
                        <AlertTitle> Error </AlertTitle>
                        { errorMessage }
                    </Alert>: ""}
                <Grid container display="flex" sx={{ border: 1, width: '100%', m:2}}  columns={{ xs: 2, sm: 8, md: 12 }}>
                    <Grid xs={6} sx={{ border: 1 }}>
                        <h1>{film.title}</h1>
                        <h3>{film.releaseDate}</h3>
                        <CardMedia
                            component="img"
                            height="600"
                            src={"http://localhost:4941/api/v1/films/" + film.filmId +"/image"}
                            alt="green iguana"
                            sx={{ objectFit: "fill" }}
                        />
                    </Grid>
                    <Grid xs={6} sx={{ border: 1 }}>
                        <Tabs
                            value={tab}
                            onChange={handleTabChange}
                            centered
                            textColor="secondary"
                            indicatorColor="secondary"
                        >
                            <Tab value="one" label="Item One" />
                            <Tab value="two" label="Item Two" />
                        </Tabs>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default Film;