import Grid from "@mui/material/Unstable_Grid2";
import React from "react";
import Typography from "@mui/material/Typography";
import AddPicture from "./AddPicture";
import {Paper} from "@mui/material";

const UpdateProfilePicture = () => {

    return(
        <Paper elevation={3} sx={{m:6, ml:10, mr:10, pb:8}}>
            <Grid container justifyContent="center" spacing={2}>
                <Grid xs={12}>
                    <Typography variant="h4" align="center">Update Profile Picture</Typography>
                </Grid>
                <Grid xs={12}>
                    <AddPicture />
                </Grid>
            </Grid>
        </Paper>

    )
}

export default UpdateProfilePicture