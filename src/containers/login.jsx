import React from 'react'
import LoginForm from '../components/loginForm'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as loginActions from '../actions/loginActions'
// import loginForm from '../components/loginForm'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.submit = this.submit.bind(this)
  }
  submit (values) {
    if (values.email.length > 0) {
      this.props.actions.login(values.email, values.password)
    }
  }
  render () {
    return (
      <div>
        <header id="login">
          <div className="wrap block-center text-center">
            <div id="logo-index" className="block-center"></div>
            <h4>Sistema administrador de recursos</h4>
          </div>
        </header>
        <section className="login">
          <div className="container">
            <LoginForm onSubmit={this.submit} />
          </div>
          <div className="push"></div>
          { (this.props.session.loginError) ? <p className="text-center">{this.props.session.loginError}</p> : '' }
        </section>
        <footer>
          <div className="container">
            <p className="text-center">
              Este Sistema Administrador es exclusivo de Oasis Hoteles & Resorts
              <br /> OASIS HOTELES © Todos los Derechos Reservados
              <br /> • Dudas o asesoría contáctenos Tel. (998) 848 9950 ext. 221
            </p>
          </div>
        </footer>
      </div>
    )
  }
}
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(loginActions, dispatch)
  }
}
function mapStateToProps ({session}) {
  return {
    session
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)
