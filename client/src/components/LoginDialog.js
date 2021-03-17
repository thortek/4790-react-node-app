import React, { useContext } from 'react'
import { Box, Dialog, TextField, Button, makeStyles } from '@material-ui/core'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { AuthContext } from '../contexts/AuthContext'

const useStyles = makeStyles(() => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 300,
    minWidth: 400,
    padding: 20,
  },
}))

const LoginDialog = (props) => {
  const classes = useStyles()
  const { open, onClose } = props

  const authContext = useContext(AuthContext)
  const { signInWithGoogle, signInWithEmailAndPassword } = authContext

  const handleGoogleClick = async () => {
    try {
      await signInWithGoogle()
      handleClose()
    } catch (error) {
      console.error(error)
    }
  }

  const handleClose = () => {
    onClose(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby='Login Dialog'>
      <Button
        className={classes.googleButton}
        fullWidth
        onClick={handleGoogleClick}
        size="large"
        variant="contained"
      >
        <img alt="Google" className={classes.providerIcon} src="/static/images/google.svg"/>
        </Button>
      <Formik
        initialValues={{
          email: 'foo@example.com',
          password: 'dkj8u4(&#Ldljad',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Must be a valid email')
            .max(50)
            .required('Email is required'),
          password: Yup.string()
            .min(8, 'Password is too short!')
            .max(50, 'Password is too long!')
            .required('Password is required'),
        })}
        onSubmit={ async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            await signInWithEmailAndPassword(values.email, values.password)
            console.log(values.email, values.password)
            handleClose()
          } catch (err) {
            console.error(err)
            setStatus({ success: false })
            setErrors({ submit: err.message })
            setSubmitting(false)
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form noValidate autoComplete='off' onSubmit={handleSubmit} className={classes.dialogContent}>
            <h2>Sign in</h2>
            <TextField
              autoFocus
              label='Email Address'
              type='email'
              name='email'
              variant='filled'
              margin='normal'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              required
              fullWidth
            />
            <TextField
              label='Password'
              type='password'
                variant='filled'
                name='password'
              margin='normal'
                placeholder='********'
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                required
                fullWidth
            />
            <Box>
              <Button color='primary' variant='contained' onClick={handleClose}>
                Cancel
              </Button>
              <Button color='primary' variant='contained' type='submit' disabled={Boolean(errors.email || errors.password)}>Login</Button>
            </Box>
          </form>
        )}
      </Formik>
    </Dialog>
  )
}

export default LoginDialog
