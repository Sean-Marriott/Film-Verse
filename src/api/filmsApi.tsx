import axios from "axios"

const filmsApi = axios.create({
    baseURL: "http://localhost:4941/api/v1/films"
})

export const getFilmsParametrised = async (searchTerm: string,
                                           filterGenres: string[],
                                           filterAgeRatings: string[],
                                           sort: string,
                                           directorId: string) => {

    let querySearch;
    let queryDirectorId;
    if (searchTerm !== "") {querySearch = searchTerm}
    if (directorId !== "") {queryDirectorId = directorId}

    const response = await filmsApi.get("/", {params: {
            q: querySearch,
            genreIds: filterGenres,
            ageRatings: filterAgeRatings,
            sortBy: sort,
            directorId: queryDirectorId
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
        runtime: formData.get('runtime')? formData.get('runtime'):undefined,
        ageRating: formData.get('ageRating')? formData.get('ageRating'):undefined
    })
    console.log(submitData)
    const response = await filmsApi.post("/", submitData, {headers: {'X-Authorization': authtoken, 'Content-Type': 'application/json'}})

    return response.data

}

export const updateFilm = async (film: Film) => {
    return await filmsApi.patch('/${film.filmId}', film)
}

export const deleteFilm = async (filmId: number) => {
    return await filmsApi.delete('/${film.filmId}')
}

export default filmsApi
