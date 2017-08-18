import React from 'react'
import Header from '../components/header'
import Menu from '../components/menu'
import Footer from '../components/footer'
import { connect } from 'react-redux'

class Layout extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <div className='wrap-container'>
          <Header session={this.props.session.user} />
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
function mapStateToProps ({session}) {
  return {
    session
  }
}
export default connect(mapStateToProps, null)(Layout)

