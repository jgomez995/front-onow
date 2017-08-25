import React from 'react'
import Header from '../components/header'
import Menu from '../components/menu'
import Footer from '../components/footer'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import * as loginActions from '../actions/loginActions'

class Layout extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <div className='wrap-container'>
          <Header session={this.props.session.user} logout={this.props.actions.logout} />
          <main className='main'>
            <Menu />
            {this.props.component}
          </main>
        </div>
        <Footer />
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
export default connect(mapStateToProps, mapDispatchToProps)(Layout)

