import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from 'react-redux'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { Link } from 'react-router-dom'

import LpCard from '../../components/lps/LpCard'
import { lpCollectionRequest, lpDeleteRequest } from '../../actions/lpActions'
import ConfirmationDialog from '../../components/shared/ConfirmationDialog'
import { Paper } from '@material-ui/core'
import { CircularProgress } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
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
    highlightBox: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.primary[50],
        marginBottom: theme.spacing(2)
    }
}));


const LpCollectionPage = () => {

    const { t } = useTranslation()

    const dispatch = useDispatch()

    const classes = useStyles()

    const lpCollection = useSelector((state) => state.lpCollection)
    const { loading, lps } = lpCollection

    // const [deleteDialog, setDeleteDialog] = useState({})
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [selectedLp, setSelectedLp] = useState({})


    const onDeleteHandler = (lp) => {
        setSelectedLp(lp)
        setOpenDeleteDialog(true)
    }

    const deleteLp = (id) => {
        dispatch(lpDeleteRequest(id))
        closeDeleteDialog()
    }

    const closeDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }

    const deleteDialogProps = {
        open: openDeleteDialog,
        title: t('lpDelete.title'),
        message: t('lpDelete.message', { lpTitle: selectedLp.title }),
        confirmButtonMsg: t('form.delete'),
        confirmButtonColor: 'secondary',
        handleConfirm: () => deleteLp(selectedLp._id),
        cancelButtonMsg: t('form.cancel'),
        handleCancel: closeDeleteDialog
    }

    //Quan es renderitza el component per primera vegada, carreguem el llistat de lps
    useEffect(() => {
        dispatch(lpCollectionRequest())
    }, [])


    return (
        <React.Fragment>
            <Container className={classes.cardGrid} maxWidth="xl">
                {
                    lps && lps.length > 0 ?
                        <Grid container spacing={4}>
                            <React.Fragment>
                                {lps.map((lp) => (
                                    <Grid item key={lp._id} xs={12} sm={6} md={4} lg={3} xl={2}>
                                        <LpCard lp={lp} onDelete={onDeleteHandler} />
                                    </Grid>
                                ))
                                }
                            </React.Fragment>

                        </Grid>
                        :
                        <Container maxWidth="md">
                            {!loading ?
                                <Paper className={classes.paper}>
                                    <Paper elevation={0} className={classes.highlightBox}>
                                        <Typography variant="h6" align="center" gutterBottom>{t('lpCollection.empty')}</Typography>
                                    </Paper>
                                    <Grid container justify="center">
                                        <Fab component={Link} size="large" to="/lp/new"
                                            color="primary" aria-label="add">
                                            <AddIcon />
                                        </Fab>
                                    </Grid>
                                </Paper>
                                :
                                <Grid container justify="center">
                                    <CircularProgress />
                                </Grid>
                            }
                        </Container>
                }
            </Container>
            <ConfirmationDialog dialogProps={deleteDialogProps} />
        </React.Fragment>
    )
}

export default LpCollectionPage

