type Film = {
    filmId: number,
    title: string,
    description: string,
    genreId: number,
    directorId: number,
    directorFirstName: string,
    directorLastName: string,
    releaseDate: string,
    ageRating: string,
    rating: number,
    image: string,
    numReviews: number,
    runtime: number
}

type Genre = {
    genreId: number,
    name: string
}

type Review = {
    reviewerId: number,
    rating: number,
    review: string,
    reviewerFirstName: string,
    reviewerLastName: string,
    timestamp: string
}