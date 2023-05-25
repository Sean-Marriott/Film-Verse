import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Alert, FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useMutation} from "react-query";
import {login, signup} from "../api/usersApi";
import {AxiosError} from "axios";
import {useState} from "react";
import {useUserStore} from "../store";

interface ISignupForm {
    handleNext: () => void;
}
const SignupForm = (props: ISignupForm) => {
    const loggedInUserId = useUserStore(state => state.userId)
    const setAuthToken = useUserStore((state) => state.setAuthToken)
    const setUserId = useUserStore((state) => state.setUserId)
    const [showPassword, setShowPassword] = React.useState(false);
    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [firstNameError, setFirstNameError] = React.useState(false)
    const [lastNameError, setLastNameError] = React.useState(false)
    const [emailError, setEmailError] = React.useState(false)
    const [passwordError, setPasswordError] = React.useState(false)
    const [signupAxiosError, setSignupAxiosError] = useState("")
    const [loginAxiosError, setLoginAxiosError] = useState("")
    const loginMutation = useMutation(login, {
        onSuccess: (data) => {
            console.log(data)
            setAuthToken(data.token)
            setUserId(data.userId)
            props.handleNext()
        },
        onError: (error: AxiosError) => {
            setLoginAxiosError(error.response?.statusText || "Axios Error: Unknown")
        }
    })
    const signupMutation  = useMutation(signup, {
        onSuccess: () => {
            const form = new FormData()
            form.set('email', email)
            form.set('password', password)
            loginMutation.mutate(form)
        },
        onError: (error: AxiosError) => {
            if (error.response) {setSignupAxiosError("Unable to signup: " + error.response.statusText)}
            else {setSignupAxiosError("Unable to upload signup: " + error.message)}
        },
    })
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginAxiosError("")
        setSignupAxiosError("")
        if (validateData()) {
            signupMutation.mutate(new FormData(event.currentTarget))
        }
    };



    console.log(loggedInUserId)



    function validateData() {
        let valid = true
        setFirstNameError(false)
        setLastNameError(false)
        setEmailError(false)
        setPasswordError(false)
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

        if (firstName === "") {
            setFirstNameError(true)
            valid = false
        }

        if (lastName === "") {
            setLastNameError(true)
            valid = false
        }

        if (email === "" || !emailRegex.test(email)) {
            setEmailError(true)
            valid = false
        }

        if (password === "" || password.length < 6) {
            setPasswordError(true)
            valid = false
        }

        return valid
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                onChange={(e) => setFirstName(e.target.value)}
                                error={firstNameError}
                                helperText={firstNameError ? "Please enter a first name" : ""}
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                onChange={(e) => setLastName(e.target.value)}
                                error={lastNameError}
                                helperText={lastNameError ? "Please enter a last name" : ""}
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                error={emailError}
                                helperText={emailError ? "Please enter a valid email" : ""}
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{ width: '100%' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Password  *</InputLabel>
                                <OutlinedInput
                                    name="password"
                                    error={passwordError}
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => setPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password *"
                                />
                                {passwordError && (
                                    <FormHelperText error id="outlined-adornment-password-error">
                                        Please enter at least 6 characters
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                    {signupAxiosError !== "" && <Grid><Typography component="h1" variant="h5"><Alert severity="error">{signupAxiosError}</Alert></Typography></Grid>}
                    {loginAxiosError !== "" && <Grid><Typography component="h1" variant="h5"><Alert severity="error">{loginAxiosError}</Alert></Typography></Grid>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default SignupForm;