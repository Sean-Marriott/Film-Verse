import Button from "@mui/material/Button";
import * as React from "react";
import {ChangeEvent, useState} from "react";
import {useMutation} from "react-query";
import {uploadProfilePic} from "../api/usersApi";
import {AxiosError} from "axios";
import {Alert, Avatar, Snackbar, Stack} from "@mui/material";
import {useUserStore} from "../store";
import {useNavigate} from "react-router-dom";

const AddPicture = () => {
    const navigate = useNavigate()
    const currentUserId = useUserStore(state => state.userId)
    const [profileImage, setProfileImage] = useState<File | null> (null)
    const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false)
    const [imageUploadAxiosError, setImageUploadAxiosError] = React.useState("")
    const [imageError, setImageError] = useState(false);
    const defaultImage = "http://localhost:4941/api/v1/users/" + currentUserId + "/image";
    const handleImageError = () => {
        console.log("Image Error: Resulting to default image")
        setImageError(true);
    };
    const uploadProfilePicMutation = useMutation(uploadProfilePic, {
        onSuccess: () => {
            navigate("/profile")
        },
        onError: (error: AxiosError) => {
            console.log(error)
            if (error.response) {setImageUploadAxiosError("Unable to upload image: " + error.response.statusText)}
            else {setImageUploadAxiosError("Unable to upload image: " + error.message)}
            setOpenErrorSnackbar(true)
        }
    })
    const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files)
        if (event.target.files && event.target.files.length > 0) {
            setProfileImage(event.target.files[0])
            if (event.target.files[0]) {
                uploadProfilePicMutation.mutate(event.target.files[0])
            }
        }
    }

    const handleCloseErrorSnackbar = () => {
        setOpenErrorSnackbar(false)
    };

    return (
        <Stack alignItems="center" spacing={2}>
            <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={handleCloseErrorSnackbar} anchorOrigin={{ vertical:"bottom", horizontal:"left" }}>
                <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
                    {imageUploadAxiosError}
                </Alert>
            </Snackbar>
            <Avatar
                alt="User Profile Picture"
                src={imageError ? defaultImage:"defaultProfilePic.png"}
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
                    onChange={handleProfileImageChange}
                    hidden
                />
            </Button>
        </Stack>
    )
}
 export default AddPicture