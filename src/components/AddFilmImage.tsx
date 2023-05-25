import Button from "@mui/material/Button";
import {Stack} from "@mui/material";
import * as React from "react";
import {ChangeEvent} from "react";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
interface IAddFilmImage {
    submitFilm: () => void
    setFilmImage: (filmImage: File) => void
}
const AddFilmImage = (props: IAddFilmImage) => {
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
            <AddPhotoAlternateIcon />
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