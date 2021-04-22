import React from "react"
import Box from "@material-ui/core/Box"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  circularProgress: {
    color: theme.palette.success.light,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}))

const ButtonCircularProgress = () => {

  const classes = useStyles();

  return (
    <Box color="secondary.main" display="flex">
      <CircularProgress
        size={24}
        className={classes.circularProgress}
      />
    </Box>
  )
}

export default ButtonCircularProgress
