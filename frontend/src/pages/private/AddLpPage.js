import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from 'react-redux'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import Hidden from '@material-ui/core/Hidden'

import { lpPreloadExternalData, lpPreloadExternalDataClear } from '../../actions/lpActions'
import SearchAlbum from '../../components/lps/SearchAlbum'
import CreateLp from '../../components/lps/CreateLp'
import UploadLpCover from '../../components/lps/UploadLpCover'
import history from '../../history'


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    wrapper: {
        margin: 0,
        position: 'relative',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer - 1,
        color: '#fff'
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));

const SEARCH = 'SEARCH'
const FILL_DATA = 'FILL_DATA'
const ADD_COVER = 'ADD_COVER'
const formSteps = [SEARCH, FILL_DATA, ADD_COVER]

const AddLpPage = () => {

    const dispatch = useDispatch()

    const classes = useStyles()
    const [activeStepIndex, setActiveStepIndex] = useState(0)

    const addLp = useSelector((state) => state.lpAdd)
    const { status, preload } = addLp

    const handleNext = () => {
        setActiveStepIndex(activeStepIndex + 1)
    }

    const handleBack = () => {
        setActiveStepIndex(activeStepIndex - 1)
    }

    const handleSearchResultSelected = async (searchResult) => {
        dispatch(lpPreloadExternalData(searchResult))
    }

    //Quan la precàrrega finalitza mostrem el formulari
    useEffect(() => {
        if (status && status.moveStep) {

            if (activeStepIndex < formSteps.length - 1)
                handleNext()
            else
                //Si es l'últim pas, redirigim a la col·lecció de lps
                history.push('/lp/collection')
        }
    }, [status])

    useEffect(() => {
        setActiveStepIndex(0)
        return () => dispatch(lpPreloadExternalDataClear())
    }, [])

    const getStepContent = (step) => {
        switch (step) {
            case SEARCH:
                return <SearchAlbum onSearchResultSelected={handleSearchResultSelected} handleNext={handleNext} />
            case FILL_DATA:
                return <CreateLp preload={addLp.preload} handleBack={handleBack} />
            case ADD_COVER:
                return <UploadLpCover lpProps={{
                    id: addLp.add.lp._id,
                    cover: preload.preloadedData ? preload.preloadedData.coverImg : (preload.searchResult ? preload.searchResult.coverImg : undefined)
                }} />
            default:
                return null
            // throw new Error('Unknown step')
        }
    }

    const { t } = useTranslation();
    const steps = [t('addLP.searchAlbum'), t('addLP.completeAlbumData'), t('addLP.addPictures')]


    return (
        <React.Fragment>
            <Container maxWidth="xl">
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h4" align="center">
                        {t('addLP.title')}
                    </Typography>
                    <Hidden mdDown>
                        <Stepper activeStep={activeStepIndex} className={classes.stepper} variant="dots">
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Hidden>
                    <React.Fragment>
                        {getStepContent(formSteps[activeStepIndex])}
                    </React.Fragment>
                </Paper>
            </Container>
            {/* Modal per la precarrega */}
            <Backdrop className={classes.backdrop} open={status && status.loading ? status.loading : false}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </React.Fragment>
    )
}

export default AddLpPage
