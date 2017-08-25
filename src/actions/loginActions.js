import * as actionTypes from './actionTypes'
import axios from 'axios'
import {push} from 'react-router-redux'

const API_URL = 'http://localhost:8080/admin'

export const login = (email, password) => {
  return (dispatch) => {
    axios.post(`${API_URL}/auth`, {email: email, password: password})
    .then(response => {
      if (response.data.error) {
        throw new Error(response.data.error)
      } else {
        console.log(response.data)
        dispatch(loginSuccess(response.data))
        // dispatch(replace('/home'))
        dispatch(push('/home'))
      }
    })
    .catch(error => {
      dispatch(loginFailed(error.message))
    })
  }
}

export const logout = () => {
  return {type: actionTypes.LOGOUT}
}
const loginSuccess = (user) => {
  return {type: actionTypes.LOGIN_SUCCESS, payload: user}
}
const loginFailed = (error) => {
  return {type: actionTypes.LOGIN_FAILED, error}
}
