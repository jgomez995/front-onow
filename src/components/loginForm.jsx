import React from 'react'
import { Field, reduxForm } from 'redux-form'

const userField = (field) => (
  <div className="user_input">
    <span><i className="fa fa-user fa-lg"></i></span>
    <input {...field.input} type="text" className="form-control" placeholder="Correo" />
    {field.meta.touched && field.meta.error &&
      <span className="error">{field.meta.error}</span>}
  </div>
)
const passwordField = (field) => (
  <div className="user_input">
    <span><i className="fa fa-lock fa-lg"></i></span>
    <input {...field.input} type="password" className="form-control" placeholder="Password" />
  </div>
)
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'email no válido'
    : undefined
const required = value => (value ? undefined : 'Required')

let LoginForm = props => {
  console.log(props)
  const { handleSubmit, pristine, submitting, reset } = props
  return (
    <form onSubmit={handleSubmit} className="block-center">
      <Field name="email" component={userField} validate={[required, email]} />
      <Field name="password" component={passwordField} validate={[required]} />
      <div className="user_input">
        <input type="submit" className="form-control btn btn-login" disabled={pristine || submitting} value="Login" />
      </div>
    </form>
  )
}

LoginForm = reduxForm({
  // a unique name for the form
  form: 'loginForm'
})(LoginForm)

// alternativo
// create new, "configured" function
//createReduxForm = reduxForm({ form: 'contact' })

// evaluate it for ContactForm component
//ContactForm = createReduxForm( ContactForm )

export default LoginForm
