import axios from "axios"

const usersApi = axios.create({
    baseURL: "http://localhost:4941/api/v1/users"
})

export const getUser = async (userId: number, loggedInUserToken: string) => {
    const response = await usersApi.get("/" + userId, {headers: {'X-Authorization': loggedInUserToken}})
    return response.data
}
export const login = async (formData: FormData) => {
    const submitData = JSON.stringify({
        "email": formData.get('email'),
        "password": formData.get('password'),
    })
    const response = await usersApi.post("/login", submitData, {headers: {'Content-Type': 'application/json'}})
    return response.data
}

export const signup = async (formData: FormData) => {
    const submitData = JSON.stringify({
        "email": formData.get('email'),
        "password": formData.get('password'),
        lastName: formData.get('lastName'),
        firstName: formData.get('firstName')
    })
    const response = await usersApi.post('http://localhost:4941/api/v1/users/register', submitData, {headers: {'Content-Type': 'application/json'}})
    return response.data
}

export const logout = async (loggedInUserToken: string) => {
    if (loggedInUserToken !== "") {
        const response = await usersApi.post("/logout", {}, {headers: {'X-Authorization': loggedInUserToken}})
        return response.data
    }
}

export const uploadProfilePic = async (image: File) => {
    let userId = localStorage.getItem("userId")
    let loggedInUserToken = localStorage.getItem("authToken")
    if (image && loggedInUserToken !== "") {
        const response = await usersApi.put("/" + userId + "/image", image, {headers: {'X-Authorization': loggedInUserToken, 'Content-Type': image.type}}  )
        return response.data
    }
}

export const editProfile = async (formData: FormData) => {
    let loggedInUserToken = localStorage.getItem("authToken")
    let userId = localStorage.getItem("userId")
    if (loggedInUserToken !== "" && userId !== "") {
        const submitData = JSON.stringify({
            email: formData.get('email'),
            lastName: formData.get('lastName'),
            firstName: formData.get('firstName'),
            currentPassword: formData.get('currentPassword') || undefined,
            password: formData.get('newPassword') || undefined,

        })
        console.log(submitData)
        const response = await usersApi.patch('http://localhost:4941/api/v1/users/' + userId, submitData, {headers: {'X-Authorization': loggedInUserToken, 'Content-Type': 'application/json'}})
        return response.data
    }
}

export const removeProfilePicture = async () => {
    let userId = localStorage.getItem("userId")
    let loggedInUserToken = localStorage.getItem("authToken")
    if (loggedInUserToken !== "") {
        const response = await usersApi.delete("/" + userId + "/image", {headers: {'X-Authorization': loggedInUserToken}}  )
        return response.data
    }
}