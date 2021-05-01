import React from 'react'
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt'
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied'
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    conditionIcon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2),
    },
}))

const renderConditionIcon = (condition, className) => {
    switch (condition) {
        case 'mint':
            return <SentimentVerySatisfiedIcon fontSize="small" className={className} />
        case 'nearmint':
            return <InsertEmoticonIcon fontSize="small" className={className} />
        case 'vgood':
            return <SentimentSatisfiedAltIcon fontSize="small" className={className} />
        case 'good':
            return <SentimentSatisfiedIcon fontSize="small" className={className} />
        case 'fair':
            return <SentimentDissatisfiedIcon fontSize="small" className={className} />
        case 'poor':
            return <SentimentVeryDissatisfiedIcon fontSize="small" className={className} />
        default:
            return null;
    }
}

const ConditionIcon = ({ condition }) => {
    const classes = useStyles()
    return (
        renderConditionIcon(condition, classes.conditionIcon)
    )
}

export default ConditionIcon
