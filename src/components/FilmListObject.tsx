import React from "react";
import Card from "@mui/material/Card";
import {Avatar, CardActionArea, CardHeader} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

interface IFilmProps {
    film: Film
    genres: Array<Genre>
}



const FilmListObject = (props: IFilmProps) => {
    const [film] = React.useState < Film > (props.film)
    const [genres] = React.useState < Array < Genre >> (props.genres)
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
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader
                title={film.title}
            />
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    src={"http://localhost:4941/api/v1/films/" + film.filmId +"/image"}
                    alt="green iguana"
                />
                <CardContent>
                    <Grid container rowSpacing={1}>
                        <Grid xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                {getGenre(film.genreId)}
                            </Typography>
                        </Grid>
                        <Grid xs={6} display="flex" justifyContent="right" alignItems="right">
                            <Typography variant="body2" color="text.secondary">
                                {convertToDate(film.releaseDate)}
                            </Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                {film.ageRating}
                            </Typography>
                        </Grid>
                        <Grid xs={6} display="flex" justifyContent="right" alignItems="right">
                            <Typography variant="body2" color="text.secondary">
                                Rating: {film.rating}/10
                            </Typography>
                        </Grid>
                        <Grid xs={6} display="flex" alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                                {film.directorFirstName}  {film.directorLastName}
                            </Typography>
                        </Grid>
                        <Grid xs={6} display="flex" justifyContent="right" alignItems="right">
                            <Avatar alt="Remy Sharp" src={"http://localhost:4941/api/v1/users/" + film.directorId +"/image"} />
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default FilmListObject