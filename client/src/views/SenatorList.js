import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import {
  Grid,
  makeStyles
} from '@material-ui/core'
import Senator from '../components/Senator'
import { useCongressContext } from '../contexts/CongressContext'
import { AuthContext } from '../contexts/AuthContext'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  }
})) 

const SenatorList = () => {
  const classes = useStyles()
  const memberData = useCongressContext()
  const { isAuthenticated } = useContext(AuthContext)
  
/*   const [memberData, setMemberData] = useState({
    loading: false,
    senators: []
    })   */                 

/*   useEffect(() => {
    setMemberData({
      loading: false,
      senators: senateData.results[0].members
    })
  }, []) */

  return (
    isAuthenticated ?
      <div>
        <Grid className={classes.root} container spacing={2}>
          {memberData.senators.map((member, index) => {

            return (
              <Grid key={member.id + member.total_votes} item>
                <Senator senator={member}/>
              </Grid>
            )
          })}
        </Grid>
      </div>
      : <Redirect to='/'/>
    )
}

export default SenatorList
