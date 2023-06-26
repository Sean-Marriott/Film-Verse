import Button from "@mui/material/Button";
import {Avatar, Stack} from "@mui/material";
import * as React from "react";
import {ChangeEvent, useState} from "react";
interface IAddFilmImage {
    filmId: number
    submitFilm: () => void
    setFilmImage: (filmImage: File) => void
}
const AddFilmImage = (props: IAddFilmImage) => {
    const [imageError, setImageError] = useState(false);
    const defaultImage = "http://localhost:4941/api/v1/films/" + props.filmId + "/image";
    const handleImageError = () => {
        console.log("Image Error: Resulting to default image")
        setImageError(true);
    };
    const handleFilmImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            if (event.target.files[0]) {
                props.setFilmImage(event.target.files[0])
                props.submitFilm()
            }
        }
    }

    return (
        <Stack alignItems="center" spacing={2}>
            <Avatar
                alt="User Profile Picture"
                src={imageError ? "defaultFilmImage.png" : defaultImage}
                onError={handleImageError}
                sx={{ width: 200, height: 200, border:2 }}
            />
            <Button
                variant="contained"
                component="label"
            >
                Upload File
                <input
                    accept=".jpg,.jpeg,.png,.gif"
                    type="file"
                    onChange={handleFilmImageChange}
                    hidden
                />
            </Button>
        </Stack>
    )
}

export default AddFilmImage;