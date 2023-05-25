import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import AddFilmForm from "./AddFilmForm";
import {useMutation} from "react-query";
import {addFilm, uploadFilmPic} from "../api/filmsApi";
import AddFilmImage from "./AddFilmImage";
import {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";
import {Alert, Snackbar} from "@mui/material";

const steps = ['Add Film', 'Add a film hero image'];

const AddFilm = () => {
    const navigate = useNavigate()
    let filmImage: File
    const [activeStep, setActiveStep] = React.useState(0)
    const [filmData, setFilmData] = React.useState<FormData>()
    const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false)
    const [imageUploadAxiosError, setImageUploadAxiosError] = React.useState("")
    const [axiosError, setAxiosError] = React.useState("")
    const uploadFilmPicMutation = useMutation(uploadFilmPic, {
        onError: (error: AxiosError) => {
            console.log(error)
            if (error.response) {setImageUploadAxiosError("Unable to upload image: " + error.response.statusText)}
            else {setImageUploadAxiosError("Unable to upload image: " + error.message)}
            setOpenErrorSnackbar(true)
        }
    })
    const addFilmMutation  = useMutation(addFilm, {
        onSuccess: (data) => {
            navigate('/film/' + data.filmId)
        }, onError: (error: AxiosError) => {
            if (error.response) {setAxiosError("Unable to submit film: " + error.response.statusText)}
            else {setAxiosError("Unable to submit film: " + error.message)}
            handlePrevious()
        }
    })

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handlePrevious = () => {
        setActiveStep((prevActiveStep) => prevActiveStep -1);
    }


    function setFilmDataFunc(formData: FormData): void {
        console.log(formData)
        setFilmData(formData)
    }

    function setFilmImageFunc(receivedFilmImage: File) {
        filmImage = receivedFilmImage
    }

    const handleCloseErrorSnackbar = () => {
        setOpenErrorSnackbar(false)
    };

    function submitFilm() {
        if (filmData) {
            addFilmMutation.mutateAsync(filmData).then(data => {
                uploadFilmPicMutation.mutate({filmId: data.filmId, image: filmImage})
            }).catch(error => {
                console.log(error)
            })
        }
    }

    return (
        <Grid container m={3}>
            <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={handleCloseErrorSnackbar} anchorOrigin={{ vertical:"bottom", horizontal:"left" }}>
                <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
                    {imageUploadAxiosError}
                </Alert>
            </Snackbar>
            <Grid xs={12}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
                        const stepProps: { completed?: boolean } = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </Grid>
            <Grid container xs={12} alignItems="center" justifyContent="center">
                {activeStep === steps.length ? (
                    <Grid>
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you&apos;re finished
                            </Typography>
                        </React.Fragment>
                    </Grid>
                ) : (
                    <React.Fragment>
                        <Grid>
                            {activeStep === 0 && <AddFilmForm setFilmData={setFilmDataFunc} handleNext={handleNext} axiosError={axiosError} />}
                            {activeStep === 1 && <AddFilmImage filmId={-1} submitFilm={submitFilm} setFilmImage={setFilmImageFunc}/>}
                        </Grid>
                    </React.Fragment>
                )}
            </Grid>
        </Grid>
    );
}

export default AddFilm;