import React from 'react'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import Login from './login'

let Home = () => <div>hola soy el Home</div>

const MatchWhenAuthorized = ({ component: Component, ...rest, auth }) => (
  <Route {...rest} render={renderProps => (
    auth ? (
      <Component />
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
  render () {
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
      </div>
    )
  }
}

const mapStateToProps = ({ session }) => ({
  session
})

export default connect(mapStateToProps)(App)
