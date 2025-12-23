import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const submitTask = ({ url, question }) =>
  api.post("/api/tasks", { url, question });

export const getTask = (id) =>
  api.get(`/api/tasks/${id}`);

export default api;
