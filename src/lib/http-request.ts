import axios, { AxiosError } from 'axios'

const httpRequest = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

// httpRequest.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     throw error.response.data
//   },
// )

export { httpRequest }
