import Button from "@mui/material/Button";

interface IAddFilmImage {
    submitFilm: () => void;
}
const AddFilmImage = (props: IAddFilmImage) => {
    return (
        <Button variant="contained" onClick={props.submitFilm}>Upload Image</Button>
    )
}

export default AddFilmImage;