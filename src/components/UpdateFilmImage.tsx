import {Alert, Avatar, CircularProgress, Paper, Snackbar, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useUserStore} from "../store";
import {ChangeEvent, useState} from "react";
import {useMutation, useQuery} from "react-query";
import {AxiosError} from "axios";
import {getFilm, uploadFilmPic} from "../api/filmsApi";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

const UpdateFilmImage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()
    const currentUserId = useUserStore(state => state.userId)
    const [profileImage, setProfileImage] = useState<File | null> (null)
    const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false)
    const [imageUploadAxiosError, setImageUploadAxiosError] = React.useState("")
    const [imageError, setImageError] = useState(false);
    const defaultImage = "http://localhost:4941/api/v1/films/" + id + "/image";
    const {data: directorId, status, error: filmError} = useQuery('film', () => getFilm(id? id:"-1"), {
        select: data => data.directorId
    })

    const uploadFilmImageMutation = useMutation(uploadFilmPic, {
        onSuccess: () => {
            navigate("/film/" + id)
        },
        onError: (error: AxiosError) => {
            if (error.response) {setImageUploadAxiosError("Unable to upload image: " + error.response.statusText)}
            else {setImageUploadAxiosError("Unable to upload image: " + error.message)}
            setOpenErrorSnackbar(true)
        }
    })

    if (status === "loading") {
        return <Grid container mt={8} justifyContent="center"><CircularProgress/></Grid>
    }

    if (status === "error") {
        const error = filmError as Error | AxiosError
        return <Grid container mt={8} justifyContent="center"><Typography variant="h4">{"Error retrieving film: " + error.message}</Typography></Grid>
    }

    if (directorId !== currentUserId) { navigate("/") }

    const handleImageError = () => {
        console.log("Image Error: Resulting to default image")
        setImageError(true);
    };

    const handleFilmImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setProfileImage(event.target.files[0])
            if (event.target.files[0] && id) {
                uploadFilmImageMutation.mutate({image: event.target.files[0], filmId: parseInt(id as string)})
            }
        }
    }

    const handleCloseErrorSnackbar = () => {
        setOpenErrorSnackbar(false)
    };

    return (
        <Paper elevation={3} sx={{m:6, ml:10, mr:10, pb:8}}>
            <Grid container justifyContent="center" spacing={2}>
                <Grid xs={12}>
                    <Typography variant="h4" align="center">Update Film Hero Image</Typography>
                </Grid>
                <Grid xs={12}>
                    <Stack alignItems="center" spacing={2}>
                        <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={handleCloseErrorSnackbar} anchorOrigin={{ vertical:"bottom", horizontal:"left" }}>
                            <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
                                {imageUploadAxiosError}
                            </Alert>
                        </Snackbar>
                        <Avatar
                            alt="Film Hero Image"
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
                </Grid>
            </Grid>
        </Paper>
    )
}

export default UpdateFilmImage