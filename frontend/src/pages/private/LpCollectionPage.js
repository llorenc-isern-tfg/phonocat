import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'

import LpCard from '../../components/lps/LpCard'
import { lpCollectionRequest } from '../../actions/lpActions'

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    }
}));

const LpCollectionPage = () => {

    const dispatch = useDispatch()

    const classes = useStyles()

    const lpCollection = useSelector((state) => state.lpCollection)
    const { loading, lps } = lpCollection

    //Quan es renderitza el component per primera vegada, carreguem el llistat de lps
    useEffect(() => {
        dispatch(lpCollectionRequest())
    }, [])

    return (
        <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
                {
                    lps ?
                        lps.map((lp) => (
                            <Grid item key={lp._id} xs={12} sm={6} md={4}>
                                <LpCard lp={lp} />
                            </Grid>
                        ))
                        :
                        <Typography>No s'han trobat LPs</Typography>
                }
            </Grid>
        </Container>
    )
}

export default LpCollectionPage

