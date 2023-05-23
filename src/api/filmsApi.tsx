import axios from "axios"

const filmsApi = axios.create({
    baseURL: "http://localhost:4941/api/v1/films"
})

export const getFilmsParametrised = async (searchTerm: string,
                                           filterGenres: string[],
                                           filterAgeRatings: string[],
                                           sort: string) => {
    if (searchTerm === "") {
        const response = await filmsApi.get("/", {params: {
                genreIds: filterGenres,
                ageRatings: filterAgeRatings,
                sortBy: sort
        }})
        return response.data
    } else {
        const response = await filmsApi.get("/", {params: {
                q: searchTerm,
                genreIds: filterGenres,
                ageRatings: filterAgeRatings,
                sortBy: sort
            }})
        return response.data
    }
}
export const getGenres = async () => {
    const response = await filmsApi.get("/genres")
    return response.data
}

export const addFilm = async (film: Film) => {
    return await filmsApi.post("/", film)
}

export const updateFilm = async (film: Film) => {
    return await filmsApi.patch('/${film.filmId}', film)
}

export const deleteFilm = async (filmId: number) => {
    return await filmsApi.delete('/${film.filmId}')
}

export default filmsApi
