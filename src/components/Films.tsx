import axios from "axios";
import React, {useState} from "react";
import Film from "./Film"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {Avatar, CardActionArea, CardHeader, Pagination} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
const Films = () => {
    const [films, setFilms] = React.useState < Array < Film >> ([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [page, setPage] = useState(1);
    const filmsPerPage = 10;
    const pageCount = Math.ceil(films.length / filmsPerPage)

    React.useEffect(() => {
        getFilms()
    }, [])

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }

    const getFilms = () => {
        axios.get('http://localhost:4941/api/v1/films')
            .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            setFilms(response.data.films)
            }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
        })
    }

    function convertToDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    const list_of_films = () => {
        return films.slice((page - 1) * filmsPerPage, page * filmsPerPage).map((item: Film) =>
            <Grid>
                <Card sx={{ maxWidth: 345 }}>
                    <CardHeader
                        title={item.title}
                    />
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            src="contemplative-reptile.jpg"
                            alt="green iguana"
                        />
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid xs>
                                    <Typography variant="body2" color="text.secondary">
                                        Genre
                                    </Typography>
                                </Grid>
                                <Grid xs="auto" display="flex" justifyContent="right" alignItems="right">
                                    <Typography variant="body2" color="text.secondary">
                                        {convertToDate(item.releaseDate)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid xs>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.ageRating}
                                    </Typography>
                                </Grid>
                                <Grid xs="auto" display="flex" justifyContent="right" alignItems="right">
                                    <Typography variant="body2" color="text.secondary">
                                        Rating: {item.rating}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid xs>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.directorFirstName}  {item.directorLastName}
                                    </Typography>
                                </Grid>
                                <Grid xs="auto" display="flex" justifyContent="right" alignItems="right">
                                    <Avatar alt="Remy Sharp" src="avatar.jpg" />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        )
    }

    if (errorFlag) {
        return (
            <div>
                <h1>Films</h1>
                <div style={{ color: "red" }}>
                    {errorMessage}
                </div>
            </div>
        )
    } else {
        return (
            <Grid container rowSpacing={2}>
                <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
                    <h1>Films</h1>
                </Grid>
                <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
                    <Grid container spacing={6} display="flex" justifyContent="center" alignItems="center" disableEqualOverflow>
                        {list_of_films()}
                    </Grid>
                </Grid>
                <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
                    <Pagination count={pageCount} page={page} onChange={handlePageChange}  />
                </Grid>
            </Grid>
        )
    }
}

export default Films;