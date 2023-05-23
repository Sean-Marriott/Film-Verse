import axios from "axios"

const usersApi = axios.create({
    baseURL: "http://localhost:4941/api/v1/users"
})

export const login = async (formData: FormData) => {
    const submitData = JSON.stringify({
        "email": formData.get('email'),
        "password": formData.get('password'),
    })
    console.log(submitData)
    const response = await usersApi.post("/login", submitData, {headers: {'Content-Type': 'application/json'}})
    localStorage.setItem('authToken', response.data.token)
    localStorage.setItem('userId', response.data.userId)
    return response.data
}

export const signup = async (formData: FormData) => {
    const submitData = JSON.stringify({
        "email": formData.get('email'),
        "password": formData.get('password'),
        lastName: formData.get('lastName'),
        firstName: formData.get('firstName')
    })
    console.log(submitData)
    const response = await usersApi.post('http://localhost:4941/api/v1/users/register', submitData, {headers: {'Content-Type': 'application/json'}})
    localStorage.setItem('authToken', response.data.token)
    localStorage.setItem('userId', response.data.userId)
    return response.data
}
