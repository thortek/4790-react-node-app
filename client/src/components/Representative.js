import React from 'react'
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Avatar,
  makeStyles
} from '@material-ui/core'
import LazyLoad from 'react-lazyload'
import palpatine from '../assets/images/palpatine.jpeg'

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    maxHeight: 300
  },
});

const Representative = (props) => {
  const member = props.rep
  const memberMiddle = member.middle_name === null ? '' : member.middle_name
  const classes = useStyles()

  return (
      <ListItem button className={classes.root}>
      <ListItemAvatar>
        <LazyLoad once alt="..." placeholder={<Avatar src={palpatine} />}>
          <Avatar
            alt={`Avatar`}
            src={`https://www.govtrack.us/static/legislator-photos/${member.govtrack_id}-100px.jpeg`}
        />
        </LazyLoad>
        </ListItemAvatar>
        <ListItemText
          primary={`${member.first_name} ${memberMiddle} ${member.last_name}`}
        />
      <ListItemSecondaryAction>
        <Checkbox edge='end' />
        </ListItemSecondaryAction>
      </ListItem>
  )
}

export default Representative
