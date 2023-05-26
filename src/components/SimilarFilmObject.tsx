import React, {useState} from "react"
import Grid from "@mui/material/Unstable_Grid2";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import {Avatar, Chip, Stack, Typography, CardActionArea} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import StarRateIcon from '@mui/icons-material/StarRate';
import {Link} from "react-router-dom";

interface ISimilarFilmObjectProps {
    film: Film
    getGenre: (genreId: number) => string
    convertToDate: (dateString: string) => string
}
const SimilarFilmObject = (props: ISimilarFilmObjectProps) => {
    const [film] = React.useState(props.film)
    const [imageError, setImageError] = useState(false);
    const handleImageError = () => {
        console.log("Image Error: Resulting to default image")
        setImageError(true);
    };
    return (
        <Grid>
            <Card sx={{ maxWidth: 200 }}>
                <CardActionArea component={Link} to={"/film/" + film.filmId}>
                <CardMedia
                    component="img"
                    height="200"
                    src={imageError ? "/defaultFilmImage.png" : "http://localhost:4941/api/v1/films/" + film.filmId + "/image"}
                    onError={handleImageError}
                    alt="Film Hero Image"
                    sx={{ objectFit: "fill" }}
                />
                <CardContent sx={{p:1}}>
                    <Stack direction="row">
                        <Typography variant="h6" noWrap>{film.title}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                        <Chip icon={<StarRateIcon style={{ color: 'gold' }} />} label={film.rating} variant="outlined" />
                        <Chip variant="outlined" label={props.getGenre(film.genreId)}></Chip>
                    </Stack>
                    <Chip variant="outlined" label={props.convertToDate(film.releaseDate)}></Chip>
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