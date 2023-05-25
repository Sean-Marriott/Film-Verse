import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";
import SignupForm from "./SignupForm";
import AddPicture from "./AddPicture";
import {useNavigate} from "react-router-dom";

const steps = ['Signup', 'Add a profile picture'];

const Signup = () => {
    const navigate = useNavigate()
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());
    const isStepOptional = (step: number) => {
        return step === 1;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleFinish = () => {
        navigate('/profile')
    };

    return (
        <Grid container m={3}>
            <Grid xs={12}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                            optional?: React.ReactNode;
                        } = {};
                        if (isStepOptional(index)) {
                            labelProps.optional = (
                                <Typography variant="caption">Optional</Typography>
                            );
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </Grid>
            <Grid container xs={12} alignItems="center" justifyContent="center">
                    <React.Fragment>
                        <Grid>
                            {activeStep === 0 && <SignupForm handleNext={handleNext} />}
                            <Grid container spacing={2} alignItems="flex-end">
                                <Grid>
                                    {activeStep === 1 && <AddPicture />}
                                </Grid>
                                {activeStep === 1 && (
                                    <Grid>
                                        <Button color="inherit" variant="outlined" onClick={handleFinish} sx={{ mr: 1 }}>
                                            Skip
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </React.Fragment>
            </Grid>
        </Grid>
    );
}

export default Signup;