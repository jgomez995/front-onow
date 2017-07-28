import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers/rootReducer'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import createHistory from 'history/createBrowserHistory'
import { autoRehydrate, persistStore } from 'redux-persist'
import { composeWithDevTools } from 'redux-devtools-extension'

export const history = createHistory({forceRefresh: true})

const historyMiddleware = routerMiddleware(history)
const reducers = combineReducers({
  ...rootReducer,
  form: formReducer,
  router: routerReducer
})

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
export const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(historyMiddleware, thunk),
    autoRehydrate()
  )
)
persistStore(store, { whitelist: ['session'] }, () => {
  console.log('rehydration complete')
}
)
