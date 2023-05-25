import Grid from "@mui/material/Unstable_Grid2";
import React, {useState} from "react";
import Button from "@mui/material/Button";
import EditNoteIcon from '@mui/icons-material/EditNote';
import {useUserStore} from "../store";
import CardMedia from "@mui/material/CardMedia";
import {useQuery} from "react-query";
import {getUser} from "../api/usersApi";
import {CircularProgress, Paper, Stack, Tab, Tabs, Typography} from "@mui/material";
import {AxiosError} from "axios";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Grid container>
                    {children}
                </Grid>
            )}
        </div>
    );
}

const Profile = () => {
    const currentUserId = useUserStore(state => state.userId)
    const currentUserToken = useUserStore(state => state.authToken)
    const [userAxiosError, setUserAxiosError] = useState("")
    const { data: user, status: userStatus} = useQuery('profile', () => getUser(currentUserId, currentUserToken), {
        onError: (error: AxiosError) => {
            setUserAxiosError(error.response?.statusText || "Axios Error: Unknown")
        },
    })
    const [tab, setTab] = React.useState(1);
    const [imageError, setImageError] = useState(false);
    const defaultImage = "http://localhost:4941/api/v1/users/" + currentUserId + "/image";
    const handleImageError = () => {
        setImageError(true);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    if (userStatus === "loading") {
        return <Grid container mt={8} justifyContent="center"><CircularProgress/></Grid>
    }

    if (userAxiosError !== "") {
        return <Grid container mt={8} justifyContent="center"><Typography variant="h4">{"Error retrieving user: " + userAxiosError}</Typography></Grid>
    }
    console.log(user)
    return(
        <Paper elevation={3} sx={{m:6, ml:10, mr:10}}>
        <Grid container >
                <Grid xs={12} md={6} sx={{p:2}}>
                    <CardMedia
                        component="img"
                        height="500"
                        src={imageError ? defaultImage : "defaultProfilePic.png"}
                        alt="User Profile Picture"
                        onError={handleImageError}
                        sx={{ objectFit: "fill" }}
                    />
                </Grid>
                <Grid container direction="column" p={3} xs={12} md={6}>
                    <Grid xs={12}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Tabs
                                centered
                                value={tab}
                                onChange={handleTabChange}
                                textColor="secondary"
                                indicatorColor="secondary"
                            >
                                <Tab value={1} label="Overview" />
                                <Tab value={2} label="Directed Films" />
                                <Tab value={3} label="Reviewed Films" />
                            </Tabs>
                        </Stack>
                    </Grid>
                    <Grid xs={12} mt={10}>
                        <TabPanel value={tab} index={1}>
                            <Grid container xs={12} justifyContent="center" overflow="auto">
                                <Typography variant="h4">{user.firstName + " " + user.lastName}</Typography>
                            </Grid>
                            <Grid container xs={12} justifyContent="center" overflow="auto">
                                <Typography variant="h4">{user.email}</Typography>
                            </Grid>
                            <Grid container xs={12} mt={20} justifyContent="end">
                                <Grid>
                                    <Button variant="outlined" endIcon={<EditNoteIcon />}>
                                        Edit
                                    </Button>
                                </Grid>
                            </Grid>
                        </TabPanel>
                    </Grid>
                </Grid>
        </Grid>
        </Paper>

    )
}

export default Profile;