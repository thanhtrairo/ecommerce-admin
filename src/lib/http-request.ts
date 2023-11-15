import axios from 'axios'

const httpRequest = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

export { httpRequest }
