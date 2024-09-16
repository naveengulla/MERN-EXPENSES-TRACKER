import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
//!Login
const token=getUserFromStorage();
export const loginAPI = async (userData) => {
  const { email, password } = userData;
  const response = await axios.post(`${BASE_URL}/users/login`, {
    email,
    password,
  });
  //Return promise
  return response.data;
};

export const registerAPI = async ({ email, password, username }) => {
  const response = await axios.post(`${BASE_URL}/users/register`, {
    email,
    password,
    username,
  });
  //Return promise
  return response.data;
};

export const changePasswordAPI = async (newPassword) => {
  const response = await axios.put(`${BASE_URL}/users/change-password`, {
    newPassword,
  },
  {
    headers:{
      Authorization:`Bearer ${token}`
    }
  },
);
  //Return promise
  return response.data;
};

export const updateProfileAPI = async ({ email, password, username }) => {
  const response = await axios.put(`${BASE_URL}/users/update-profile`, {
    email,
    password,
    username,
  },
  {
    headers:{
      Authorization:`Bearer ${token}`
    }
  },
);
  //Return promise
  return response.data;
};