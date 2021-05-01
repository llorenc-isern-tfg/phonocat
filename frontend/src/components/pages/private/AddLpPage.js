import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useTranslation } from "react-i18next"
import { useDispatch } from 'react-redux'
import { showAlert } from '../../actions/alertActions'
import { logout } from '../../actions/userActions'

import SearchAlbum from '../../components/lps/SearchAlbum';
import AlbumDetailsForm from '../../components/lps/AlbumDetailsForm';

import { preloadAlbumDataService } from '../../services/lpServices'

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
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));




const AddLpPage = () => {

    const dispatch = useDispatch()

    const classes = useStyles()
    const [activeStep, setActiveStep] = useState(0)

    const [preloadedData, setPreloadedData] = useState({})
    const [preloadingData, setPreloadingData] = useState(false)

    const handleNext = () => {
        setActiveStep(activeStep + 1)
    }

    const handleBack = () => {
        setActiveStep(activeStep - 1)
    }

    const handleSearchResultSelected = async (searchResult) => {
        try {
            setPreloadingData(true)
            const { data } = await preloadAlbumDataService(searchResult.name, searchResult.artist)
            showAlert('success', { messageKey: 'searchAlbum.preloadDataComplete' })
            setPreloadedData(data)
        } catch (error) {
            //TODO: centralitzar gestió d'error de les respostes al service?
            console.log(error.response)
            if (error.response && error.response.status === 401) {
                logout()
                showAlert('error', { messageKey: 'session.expired' })
                return
            }

            console.log(error)
            showAlert('warning', { messageKey: 'searchAlbum.preloadDataNotFound' })
            setPreloadedData({ title: searchResult.name, artist: searchResult.artist })
        }
        setPreloadingData(false)
        handleNext()
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <SearchAlbum onSearchResultSelected={handleSearchResultSelected} />
            case 1:
                return <AlbumDetailsForm preloadedData={preloadedData} />
            case 2:
                return null
            default:
                throw new Error('Unknown step')
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
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {/* //TODO: afegir stepper reduït per versio mobil */}
                    <React.Fragment>
                        {getStepContent(activeStep)}
                        <div className={classes.buttons}>
                            {activeStep !== 0 && (
                                <Button onClick={handleBack} className={classes.button}>
                                    {t('form.back')}
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}
                            >
                                {activeStep === steps.length - 1 ? t('form.save') : t('form.next')}
                            </Button>
                        </div>
                    </React.Fragment>
                </Paper>
            </Container>
            {/* Modal per la precarrega */}
            <Backdrop className={classes.backdrop} open={preloadingData}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </React.Fragment>
    )
}

export default AddLpPage
