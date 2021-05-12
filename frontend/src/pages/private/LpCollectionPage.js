import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from 'react-redux'

import LpCard from '../../components/lps/LpCard'
import { lpCollectionRequest, lpDeleteRequest } from '../../actions/lpActions'
import ConfirmationDialog from '../../components/shared/ConfirmationDialog'

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
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
        message: t('lpDelete.message', selectedLp.title),
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
                <Grid container spacing={4}>
                    {
                        lps && lps.length > 0 ?
                            lps.map((lp) => (
                                <Grid item key={lp._id} xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <LpCard lp={lp} onDelete={onDeleteHandler} />
                                </Grid>
                            ))
                            :
                            !loading && <Typography>No s'han trobat LPs</Typography>
                    }
                </Grid>
            </Container>
            <ConfirmationDialog dialogProps={deleteDialogProps} />
        </React.Fragment>
    )
}

export default LpCollectionPage

