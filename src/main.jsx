import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { history, store } from './config/configureStore'
import App from './containers/app'

import { ConnectedRouter } from 'react-router-redux'

// Create a history of your choosing (we're using a browser history in this case

// Build the middleware for intercepting and dispatching navigation actions

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))

ReactDOM.render(
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
