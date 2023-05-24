import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import AddFilmForm from "./AddFilmForm";
import {useMutation} from "react-query";
import {addFilm} from "../api/filmsApi";
import AddFilmImage from "./AddFilmImage";

const steps = ['Add Film', 'Add a film hero image'];

const AddFilm = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [filmData, setFilmData] = React.useState<FormData>()
    const addFilmMutation  = useMutation(addFilm)

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };


    function setFilmDataFunc(formData: FormData): void {
        console.log(formData)
        setFilmData(formData)
    }

    function submitFilm() {
        if (filmData) {
            addFilmMutation.mutate(filmData)
        }
    }

    return (
        <Grid container m={3}>
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
                            {activeStep === 0 && <AddFilmForm setFilmData={setFilmDataFunc} handleNext={handleNext} />}
                            {activeStep === 1 && <AddFilmImage submitFilm={submitFilm}/>}
                        </Grid>
                    </React.Fragment>
                )}
            </Grid>
        </Grid>
    );
}

export default AddFilm;