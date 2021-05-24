import React from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { useTranslation } from "react-i18next"

import { lpAdd } from '../../actions/lpActions'
import LpForm from './LpForm'


const useStyles = makeStyles((theme) => ({
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}))

const CreateLp = ({ preload, handleBack }) => {

    const { t } = useTranslation()

    const actions = () => {
        return (
            <div className={classes.buttons}>
                <Button onClick={handleBack}
                    className={classes.button} variant="contained"
                    color="default">
                    {t('form.back')}
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                >
                    {t('form.save')}
                </Button>
            </div>
        )
    }

    const dispatch = useDispatch()

    const { searchResult, preloadedData } = preload
    const lpData = preloadedData ? preloadedData : (searchResult ? searchResult : {})

    const handleSubmit = (lp) => {
        dispatch(lpAdd(lp))
    }

    const classes = useStyles()

    return (
        <LpForm lpData={lpData} actions={actions} handleSubmit={handleSubmit} />
    )
}

export default CreateLp
