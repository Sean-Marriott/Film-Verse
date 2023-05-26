import axios from "axios"

const filmsApi = axios.create({
    baseURL: "http://localhost:4941/api/v1/films"
})

export const getFilmsParametrised = async (searchTerm: string,
                                           filterGenres: string[],
                                           filterAgeRatings: string[],
                                           sort: string,
                                           directorId: string,
                                           reviewerId: string,
                                           startIndex: string,
                                           count: string) => {

    let querySearch;
    let queryDirectorId;
    let queryReviewerId;
    let queryStartIndex;
    let queryCount;
    if (searchTerm !== "") {querySearch = searchTerm}
    if (directorId !== "") {queryDirectorId = directorId}
    if (reviewerId !== "") {queryReviewerId = reviewerId}
    if (startIndex !== "") {queryStartIndex = startIndex}
    if (count !== "") {queryCount = count}


    const response = await filmsApi.get("/", {params: {
            q: querySearch,
            genreIds: filterGenres,
            ageRatings: filterAgeRatings,
            sortBy: sort,
            directorId: queryDirectorId,
            reviewerId: queryReviewerId,
            startIndex: queryStartIndex,
            count: queryCount
        }})
    return response.data
}

export const getFilm = async (filmId: string) => {
    const response = await filmsApi.get('/' + filmId)
    return response.data
}

export const getGenres = async () => {
    const response = await filmsApi.get("/genres")
    return response.data
}

export const getReviews = async (filmId: string) => {
    const response = await filmsApi.get('/' + filmId + '/reviews')
    return response.data
}

export const addFilm = async (formData: FormData) => {
    const authtoken = localStorage.getItem('authToken')

    const submitData = JSON.stringify({
        title: formData.get('filmTitle'),
        description: formData.get('description'),
        releaseDate: formData.get('releaseDate')? formData.get('releaseDate'):undefined,
        genreId: parseInt(formData.get('genre') as string),
        runtime: formData.get('runtime')? parseInt(formData.get('runtime') as string):undefined,
        ageRating: formData.get('ageRating')? formData.get('ageRating'):undefined
    })
    const response = await filmsApi.post("/", submitData, {headers: {'X-Authorization': authtoken, 'Content-Type': 'application/json'}})

    return response.data

}

export const addReview = async (formData: FormData) => {
    if (formData) {
        const authtoken = localStorage.getItem('authToken')
        const filmId = formData.get('filmId')

        const submitData = JSON.stringify({
            rating: parseFloat(formData.get('reviewRating') as string) || undefined,
            review: formData.get('reviewText') || undefined
        })
        console.log(submitData)
        const response = await filmsApi.post("/" + filmId + "/reviews", submitData, {headers: {'X-Authorization': authtoken, 'Content-Type': 'application/json'}})
        return response.data
    }
}


export const updateFilm = async (formData: FormData) => {
    const authtoken = localStorage.getItem('authToken')

    const submitData = JSON.stringify({
        title: formData.get('title'),
        description: formData.get('description'),
        // releaseDate: formData.get('releaseDate')? formData.get('releaseDate'):undefined,
        releaseDate: "2026-04-23 18:25:43",
        genreId: parseInt(formData.get('genre') as string),
        runtime: formData.get('runtime')? parseInt(formData.get('runtime') as string):undefined,
        ageRating: formData.get('ageRating')? formData.get('ageRating'):undefined
    })

    console.log(submitData)
    console.log(formData.get("filmId"));
    const response = await filmsApi.patch("/" + formData.get("filmId"), submitData, {headers: {'X-Authorization': authtoken, 'Content-Type': 'application/json'}})

    return response.data
}

export const deleteFilm = async (filmId: number, authToken: string) => {
    return await filmsApi.delete('/'+filmId, {headers: {'X-Authorization': authToken}})
}

interface IUploadFilm {
    image: File
    filmId: number
}
export const uploadFilmPic = async (props: IUploadFilm) => {
    let loggedInUserToken = localStorage.getItem("authToken")
    if (props.image && loggedInUserToken!== "") {
        const response = await filmsApi.put("/" + props.filmId + "/image", props.image, {headers: {'X-Authorization': loggedInUserToken, 'Content-Type': props.image.type}}  )
        return response.data
    }
}

export default filmsApi
