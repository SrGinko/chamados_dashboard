import axios from "axios";

const baseURL = 'https://monteirojubi.discloud.app';

const apiKey = 'PINrEymbohdYJpHsCDehv';
export const api = axios.create({
  baseURL,
  headers: {
    apikey: apiKey,
  },
});
