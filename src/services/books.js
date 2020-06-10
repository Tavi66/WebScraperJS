import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/books'

const scrape = ({url, headers}) => {
    console.log('Scraping books...');
    const request = axios.get(url, headers).then(response => {
      console.log(response.data);
        console.log('books scraped!');  
        return response.data;  
      })
      .catch(error=>console.log('error: ',error));  
      return request;
}
const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`,newObject)
    return request.then(response => response.data)
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default { scrape, getAll, create, update, remove}