import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from "@mui/material/Unstable_Grid2";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {login} from "../api/usersApi";
import {useMutation} from "react-query";
import {useState} from "react";
import {AxiosError} from "axios";
import {Alert} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useUserStore} from "../store";

const Login = () => {
    const loggedInUserId = useUserStore(state => state.userId)
    const loggedInUserToken = useUserStore(state => state.authToken)
    const setAuthToken = useUserStore((state) => state.setAuthToken)
    const setUserId = useUserStore((state) => state.setUserId)
    const navigate = useNavigate()
    const [emailAddress, setEmailAddress] = useState("");
    const [emailAddressErrorMessage, setEmailAddressErrorMessage] = useState("")
    const [password, setPassword] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
    const [axiosError, setAxiosError] = useState("")

    console.log(loggedInUserId)
    console.log(loggedInUserToken)

    const mutation  = useMutation(login, {
        onSuccess: (data) => {
            setAuthToken(data.token)
            setUserId(data.userId)
            console.log("SUCCESS")
            navigate('/films')
        },
        onError: (error: AxiosError) => {
            setAxiosError(error.response?.statusText || "Axios Error: Unknown")
        },
    })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        validateFields()
        setAxiosError("")
        if (validateFields()) {
            mutation.mutate(formData)
        }
    };

    function validateFields(): boolean{
        let valid = true
        setEmailAddressErrorMessage("")
        setPasswordErrorMessage("")
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

        if (!emailRegex.test(emailAddress) || emailAddress === "") {
            setEmailAddressErrorMessage("Please enter a valid email address")
            valid = false
        }

        if (!(password.length >= 6)) {
            setPasswordErrorMessage("Password must be at least 6 characters")
            valid = false
        }

        return valid
    }


    return (
        <Grid container m={3} component={Paper} elevation={6} square>
            <Grid
                xs={false}
                sm={4}
                md={6}
                sx={{
                    backgroundImage: 'url(LoginImage.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid xs={12} sm={8} md={6}>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            onChange={(e) => setEmailAddress(e.target.value)}
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            error = {emailAddressErrorMessage !== ""}
                            helperText={emailAddressErrorMessage}
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            name="password"
                            error = {passwordErrorMessage !== ""}
                            helperText={passwordErrorMessage}
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        {axiosError !== "" && <Grid><Typography component="h1" variant="h5"><Alert severity="error">{axiosError}</Alert></Typography></Grid>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid xs = {12} container sx={{justifyContent: 'flex-end' }}>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>)
}

export default Login;