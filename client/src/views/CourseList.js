import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { useQuery, useMutation, gql } from '@apollo/client'
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
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
  typeWidth: {
    width: '100%',
  },
}))

const ALL_COURSES = gql`
  query {
    allCourses {
      id
      title
      description
      defaultCredits
      courseCode
    }
  }
`

const UPDATE_COURSE = gql`
mutation updateCourse ($id: Int!, $title: String!, $description: String, $defaultCredits: String, $courseCode: String) {
  updateCourse (id: $id,
    data: { 
    title: $title,
    description: $description,
    defaultCredits: $defaultCredits,
    courseCode: $courseCode,
    }
  ) {
      id
  }
}
`

const DELETE_COURSE = gql`
mutation deleteCourse ($id: Int!) {
  deleteCourse (id: $id) {
    id
  }
}
`

const CourseList = () => {
  const classes = useStyles()
  const [selectedCourse, setSelectedCourse] = useState({ title: '' })
  const [debouncedTitle, setDebouncedTitle] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleInput = (event) => {
    debounce(event.target.value)
  }

  const debounce = useCallback(
    _.debounce((searchVal) => {
      setDebouncedTitle(searchVal)
    }, 1000),
    [],
  )

  const { loading, error, data } = useQuery(ALL_COURSES)
  const [updateCourse] = useMutation(UPDATE_COURSE);
  const [deleteCourse] = useMutation(DELETE_COURSE)

  if (loading) {
    return (
      <Container className={classes.root}>
        <Typography className={classes.messages}>Loading...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Typography className={classes.messages}>{`${error.message}`}</Typography>
    )
  }

  const courseList = data.allCourses

  /*  const handleSearch = () => {
    if (debouncedTitle) {
      setCourseList(courseList.filter(course => course.title.includes(debouncedTitle)))
    } else {
      //fetchCourses()
    }
  } */

  const handleDelete = async () => {
    setDeleteOpen(false)
    console.log(selectedCourse.id)
    try {
      deleteCourse({ variables: { id: selectedCourse.id } })
    } catch (err) {
      console.error(err)
    }
  }

  const handleClickEditOpen = (course) => {
    setSelectedCourse(course.course)
    setEditOpen(true)
  }

  const handleCloseEdit = () => {
    setEditOpen(false)
  }

  const handleUpdate = async (values) => {
      updateCourse({
        variables: {
          id: selectedCourse.id,
          title: values.title,
          defaultCredits: values.defaultCredits,
          courseCode: values.courseCode,
          description: values.description
        }
      })
  }
  

  const handleClickDeleteOpen = (course) => {
    setSelectedCourse(course.course)
    setDeleteOpen(true)
  }

  const handleCloseDelete = () => {
    setDeleteOpen(false)
  }

  return (
    <>
      <form>
        <Input placeholder='Search' onChange={handleInput} />
        <IconButton aria-label='search'>
          <SearchIcon />
        </IconButton>
      </form>
      <Container className={classes.root}>
        {courseList.map((course) => {
          return (
            <Card className={classes.card} key={course.id}>
              <CardMedia
                component='img'
                height='300'
                className={classes.media}
                image='/static/images/UVUSquareGreen-0001.png'
                title={course.title}
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  {course.title}
                </Typography>
                <Box className={classes.content}>
                  <Typography variant='subtitle1' color='textSecondary'>
                    Course Code: {course.courseCode}
                  </Typography>
                  <Typography variant='subtitle1' color='textSecondary'>
                    Credits: {course.defaultCredits}
                  </Typography>
                </Box>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Description</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='body2' color='textSecondary'>
                      Description: {course.description}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
              <CardActions>
                <IconButton
                  aria-label='edit'
                  onClick={() => handleClickEditOpen({ course })}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label='delete'
                  onClick={() => handleClickDeleteOpen({ course })}
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
            title: selectedCourse?.title,
            defaultCredits: selectedCourse?.defaultCredits,
            description: selectedCourse?.description,
            courseCode: selectedCourse?.courseCode,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string('Enter course title.').required(
              'Title is required',
            ),
            defaultCredits: Yup.string('Course credits number'),
            description: Yup.string('Course description'),
            courseCode: Yup.string('Course code'),
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
                  Make changes below to the data about this course:
                </DialogContentText>
                <TextField
                  autoFocus
                  id='title'
                  name='title'
                  label='Course Title'
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
                    id='defaultCredits'
                    name='defaultCredits'
                    label='Credits'
                    type='text'
                    value={values.defaultCredits}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.defaultCredits && errors.defaultCredits)}
                    helperText={touched.defaultCredits && errors.defaultCredits}
                  />
                  <TextField
                    autoFocus
                    name='courseCode'
                    id='courseCode'
                    label='Code'
                    type='text'
                    value={values.courseCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.courseCode && errors.courseCode)}
                    helperText={touched.courseCode && errors.courseCode}
                  />
                </Box>
                <TextField
                  autoFocus
                  id='description'
                  name='description'
                  label='Course Description'
                  type='text'
                  fullWidth
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                />
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
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the course {selectedCourse?.title}?
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

export default CourseList
