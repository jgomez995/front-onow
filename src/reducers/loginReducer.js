import * as types from '../actions/actionTypes'

export default function (state = { loggedIn: false }, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return { ...state, loggedIn: true, user: action.payload }
    case types.LOGIN_FAILED:
      return { ...state, loggedIn: false, loginError: action.error }
    default:
      return state
  }
}
