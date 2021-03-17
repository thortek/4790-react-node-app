import React from 'react'
import {
  makeStyles,
  CardActionArea,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@material-ui/core'
import { Twitter, Facebook } from '@material-ui/icons'
//import SenateCommittees from './SenateCommittees'

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#ddd',
    margin: '20px',
    maxWidth: 200,
    height: 600,
  }
}))

const Senator = (props) => {
  const classes = useStyles()
  const member = props.senator
  const memberMiddle = member.middle_name !== null ? member.middle_name : ''
  const fullName = `${member.first_name} ${memberMiddle} ${member.last_name}`

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component='img'
          alt='Senator'
          image={`https://www.govtrack.us/static/legislator-photos/${member.govtrack_id}-200px.jpeg`}
          title={fullName}
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            {fullName}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='div'>
           {/*  <SenateCommittees url={member.api_uri} /> */}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <IconButton color='primary' aria-label='Twitter'>
          <Twitter />
        </IconButton>
        <IconButton color='primary' aria-label='Facebook'>
                  <Facebook />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default Senator
