import React, {useState} from "react";
import Card from "@mui/material/Card";
import {Avatar, CardActionArea, CardHeader} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";

interface IFilmListProps {
    getGenre: (genreId: number) => string
    convertToDate: (dateString: string) => string
    film: Film
}
const FilmListObject = (props: IFilmListProps) => {
    const [film] = React.useState < Film > (props.film)
    const [imageError, setImageError] = useState(false);
    const defaultImage = "http://localhost:4941/api/v1/films/" + film.filmId  + "/image";
    const handleImageError = () => {
        console.log("Image Error: Resulting to default image")
        setImageError(true);
    };
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader
                title={film.title}
            />
            <CardActionArea component={Link} to={"/film/" + film.filmId}>
                <CardMedia
                    component="img"
                    height="140"
                    src={imageError ? "defaultFilmImage.png" : defaultImage}
                    onError={handleImageError}
                    alt="Film Hero Image"
                />
                <CardContent>
                    <Grid container>
                        <Grid xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                {props.getGenre(film.genreId)}
                            </Typography>
                        </Grid>
                        <Grid xs={6} display="flex" justifyContent="right" alignItems="right">
                            <Typography variant="body2" color="text.secondary">
                                {props.convertToDate(film.releaseDate)}
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
                            <Avatar alt="Director Profile Pic" src={"http://localhost:4941/api/v1/users/" + film.directorId +"/image"} />
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default FilmListObject