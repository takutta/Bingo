import axios from 'axios';

const baseUrl = '/api/cells';
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const getByPath = (path) => {
  const request = axios.get(baseUrl, { params: { path } });
  return request
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

const deleteOne = (id, path) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then(() =>
    axios
      .get(baseUrl)
      .then((response) => response.data.filter((item) => item.path === path))
  );
};

export default {
  getAll,
  getByPath,
  create,
  update,
  deleteOne,
};
