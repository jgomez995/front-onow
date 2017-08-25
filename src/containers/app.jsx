import React from 'react'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import Login from './login'
import Home from './home'
import Entretenimiento from './entretenimiento'
import CrearShow from './agregarShow'
import editarShow from './editarShow'

const MatchWhenAuthorized = ({ component: Component, ...rest, auth }) => (
  <Route {...rest} render={renderProps => (
    auth ? (
      <Component route={renderProps} />
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: renderProps.location }
      }} />
      )
  )} />
)
class App extends React.Component {
  constructor (props) {
    super(props)
    console.log(this.props)
  }
  renderLoader () {
    return (
      <div style={{background: '#000'}}>
        <p>Cargando...</p>
      </div>
    )
  }
  renderRoutes () {
    return (
      <div>
        <Route exact path='/' render={() => (
          this.props.session.loggedIn ? (
            <Redirect push to='/home' />
          ) : (
              <Login />
            )
        )} />
        <Route exact path='/login' component={Login} />
        <MatchWhenAuthorized auth={this.props.session.loggedIn} path='/home' component={Home} />
        <MatchWhenAuthorized auth={this.props.session.loggedIn} path='/entretenimiento/:hotel' component={Entretenimiento} />
        <MatchWhenAuthorized exact auth={this.props.session.loggedIn} path='/:hotel/editarShow/:actividadId' component={editarShow} />
        <MatchWhenAuthorized auth={this.props.session.loggedIn} path='/:hotel/agregarShow' component={CrearShow} />
        
      </div>
    )
  }
  render () {
    if (this.props.session.waiting) {
      return this.renderLoader()
    } else {
      return this.renderRoutes()
    }
  }
}

const mapStateToProps = ({ session }) => ({
  session
})

export default connect(mapStateToProps)(App)
