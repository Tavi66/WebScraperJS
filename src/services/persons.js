import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response=>response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl,newObject)
    return request.then(response=>response.data)
}

const remove = id => {
    const url = `${baseUrl}/${id}`
    console.log(`Deleting ${url}...`)
    return axios.delete(url)
}

const update = (id,newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => {
    console.log('newObject: ',newObject)
    console.log('response: ',response)
    console.log('response.data: ',response.data)
    return(response.data)}
    )
}


export default {getAll, create, remove, update}