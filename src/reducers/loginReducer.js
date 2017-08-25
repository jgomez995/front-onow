import * as types from '../actions/actionTypes'

export default function (state = { loggedIn: false, waiting: true }, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return { ...state, loggedIn: true, waiting: false, user: action.payload }
    case types.LOGIN_FAILED:
      return { ...state, loggedIn: false, waiting: false, loginError: action.error }
    case types.PAGE_LOADED:
      return { ...state, waiting: false }
    case types.LOGOUT:
      return { ...state, loggedIn: false, user: null }
    default:
      return state
  }
}
