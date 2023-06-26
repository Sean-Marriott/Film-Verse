import React from "react"
import {Avatar, Paper, Rating, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
interface IReviewObjectProps {
    review: Review
}

const ReviewObject = (props: IReviewObjectProps) => {
    const [review] = React.useState(props.review)
    function convertToDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    return (
        <Grid sx={{m:1}}>
            <Paper elevation={6} >
                <Grid xs={12}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={review.reviewerFirstName + "'s avatar"} src={"http://localhost:4941/api/v1/users/" + review.reviewerId +"/image"} />
                        <Typography variant="body1">{review.reviewerFirstName + " " + review.reviewerLastName}</Typography>
                        <Typography variant="subtitle2">{convertToDate(review.timestamp)}</Typography>
                    </Stack>
                </Grid>
                <Grid xs={12}>
                    <Rating max={10} name="half-rating-read" defaultValue={review.rating} precision={0.5} readOnly />
                </Grid>
                <Grid xs={12}>
                    <Typography variant="body2">{review.review}</Typography>
                </Grid>
            </Paper>
        </Grid>
    )
}

export default ReviewObject;