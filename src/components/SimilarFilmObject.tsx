import React from "react"
import Grid from "@mui/material/Unstable_Grid2";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import {Avatar, Chip, Stack, Typography, CardActionArea} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import StarRateIcon from '@mui/icons-material/StarRate';
import {Link} from "react-router-dom";

interface ISimilarFilmObjectProps {
    film: Film
    genres: Genre[]
}

const SimilarFilmObject = (props: ISimilarFilmObjectProps) => {
    const [film] = React.useState(props.film)
    const [genres] = React.useState(props.genres)

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

    return (
        <Grid>
            <Card sx={{ maxWidth: 200 }}>
                <CardActionArea component={Link} to={"/film/" + film.filmId}>
                <CardMedia
                    component="img"
                    height="200"
                    src={"http://localhost:4941/api/v1/films/" + film.filmId +"/image"}
                    alt="Film Hero Image"
                    sx={{ objectFit: "fill" }}
                />
                <CardContent sx={{p:1}}>
                    <Stack direction="row">
                        <Typography variant="h6" noWrap>{film.title}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                        <Chip icon={<StarRateIcon style={{ color: 'gold' }} />} label={film.rating} variant="outlined" />
                        <Chip variant="outlined" label={getGenre(film.genreId)}></Chip>
                    </Stack>
                    <Chip variant="outlined" label={convertToDate(film.releaseDate)}></Chip>
                    <Chip
                        avatar={<Avatar alt="Director Profile Pic" src={"http://localhost:4941/api/v1/users/" + film.directorId +"/image"} />}
                        label={film.directorFirstName + " " + film.directorLastName}
                        variant="outlined"
                    />
                </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

export default SimilarFilmObject