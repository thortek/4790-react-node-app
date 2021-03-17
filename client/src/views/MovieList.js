import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import _ from 'lodash'
import {
  Container,
  makeStyles,
  Typography,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Input,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Formik } from 'formik'
import * as Yup from 'yup'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  card: {
    width: 345,
    margin: 20,
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))

const MovieList = () => {
  const classes = useStyles()
  const [selectedMovie, setSelectedMovie] = useState({ title: '' })
  const [movieList, setMovieList] = useState([])
  const [debouncedName, setDebouncedName] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleInput = (event) => {
    debounce(event.target.value)
  }

  const debounce = useCallback(
    _.debounce((searchVal) => {
      setDebouncedName(searchVal)
    }, 1000),
    [],
  )

  const handleSearch = () => {
    if (debouncedName) {
      setMovieList(movieList.filter(movie => movie.title.includes(debouncedName)))
    } else {
      fetchMovies()
    }
  }

  const handleDelete = async () => {
    setDeleteOpen(false)
    console.log(selectedMovie._id)
    try {
      await axios.delete(`http://localhost:5050/movie/delete`, {
        data: {
          movieId: selectedMovie._id,
        },
      })
      fetchMovies()
    } catch (err) {
      console.error(err)
    }
  }

  const handleClickEditOpen = (movie) => {
    setSelectedMovie(movie.movie)
    setEditOpen(true)
  }

  const handleCloseEdit = () => {
    setEditOpen(false)
  }

  const handleUpdate = async (values) => {
    try {
      const result = await axios.put(`http://localhost:5050/movie/update`, {
        data: {
          movieId: values.id,
          title: values.title,
          rank: values.rank,
          year: values.year,
          imageUrl: values.imageUrl,
          height: values.height,
          width: values.width,
        },
      })
      if (result.status === 200) {
        fetchMovies()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleClickDeleteOpen = (movie) => {
    setSelectedMovie(movie.movie)
    setDeleteOpen(true)
  }

  const handleCloseDelete = () => {
    setDeleteOpen(false)
  }

  const fetchMovies = async () => {
    try {
      const movies = await axios.get(`http://localhost:5050/movie`)
      setMovieList(movies.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  return (
    <>
      <form>
        <Input placeholder='Search' onChange={handleInput} />
        <IconButton aria-label='search' onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </form>
      <Container className={classes.root}>
        {movieList.map((movie) => {
          return (
            <Card className={classes.card} key={movie._id}>
              <CardMedia
                component='img'
                height='300'
                className={classes.media}
                image={movie.image?.imageUrl}
                title={movie.title}
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  {movie.title}
                </Typography>
                <Box className={classes.content}>
                  <Typography variant='subtitle1' color='textSecondary'>
                    Year: {movie.year}
                  </Typography>
                  <Typography variant='subtitle1' color='textSecondary'>
                    Rank: {movie.rank}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <IconButton
                  aria-label='edit'
                  onClick={() => handleClickEditOpen({ movie })}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label='delete'
                  onClick={() => handleClickDeleteOpen({ movie })}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          )
        })}
      </Container>
      <Dialog
        open={editOpen}
        onClose={handleCloseEdit}
        aria-labelledby='edit-dialog-title'
      >
        <Formik
          initialValues={{
            title: selectedMovie?.title,
            rank: selectedMovie?.rank,
            imageUrl: selectedMovie?.image?.imageUrl,
            height: selectedMovie?.image?.height,
            width: selectedMovie?.image?.width,
            id: selectedMovie?._id,
            year: selectedMovie?.year,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string('Enter movie title.').required(
              'Title is required',
            ),
            rank: Yup.number('Movie rank number'),
            height: Yup.number('Height'),
            imageUrl: Yup.string('Image URL'),
            width: Yup.number('Width'),
            id: Yup.string('ID').required('ID is required.'),
            year: Yup.string('Year'),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              await handleUpdate(values)
              handleCloseEdit()
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
            <form
              noValidate
              autoComplete='off'
              onSubmit={handleSubmit}
              className={classes.dialogContent}
            >
              <DialogTitle id='edit-dialog-title'>Edit Movie</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Make changes below to the data about this movie:
                </DialogContentText>
                <TextField
                  autoFocus
                  id='title'
                  name='title'
                  label='Movie Title'
                  type='text'
                  fullWidth
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
                <Box className={classes.content}>
                  <TextField
                    autoFocus
                    id='year'
                    name='year'
                    label='Year'
                    type='text'
                    value={values.year}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.year && errors.year)}
                    helperText={touched.year && errors.year}
                  />
                  <TextField
                    autoFocus
                    name='rank'
                    id='rank'
                    label='Rank'
                    type='number'
                    value={values.rank}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.rank && errors.rank)}
                    helperText={touched.rank && errors.rank}
                  />
                </Box>
                <TextField
                  autoFocus
                  id='imageUrl'
                  name='imageUrl'
                  label='Image URL'
                  type='text'
                  fullWidth
                  value={values.imageUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.imageUrl && errors.imageUrl)}
                  helperText={touched.imageUrl && errors.imageUrl}
                />
                <Box className={classes.content}>
                  <TextField
                    autoFocus
                    id='height'
                    name='height'
                    label='Height'
                    type='number'
                    value={values.height}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.height && errors.height)}
                    helperText={touched.height && errors.height}
                  />
                  <TextField
                    autoFocus
                    id='width'
                    name='width'
                    label='Width'
                    type='number'
                    value={values.width}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.width && errors.width)}
                    helperText={touched.width && errors.width}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEdit} color='primary'>
                  Cancel
                </Button>
                <Button type='submit' color='primary'>
                  Save
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
      <Dialog open={deleteOpen} onClose={handleCloseDelete}>
        <DialogTitle>Delete Movie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this movie?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='primary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MovieList
