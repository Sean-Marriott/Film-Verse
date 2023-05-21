import React from "react"
import Grid from "@mui/material/Unstable_Grid2";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";

interface ISimilarFilmObjectProps {
    film: Film
}

const SimilarFilmObject = (props: ISimilarFilmObjectProps) => {
    const [film] = React.useState(props.film)

    return (
        <Grid>
            <Card sx={{ maxWidth: 200 }}>
                <CardMedia
                    component="img"
                    height="200"
                    src={"http://localhost:4941/api/v1/films/" + film.filmId +"/image"}
                    alt="Film Hero Image"
                    sx={{ objectFit: "fill" }}
                />
                <p>{film.title}</p>
            </Card>
        </Grid>
    )
}

export default SimilarFilmObject