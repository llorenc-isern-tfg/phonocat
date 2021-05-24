import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Slider from "react-slick"

const useStyles = makeStyles((theme) => ({
    mainInfo: {
        position: 'relative',
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        marginBottom: theme.spacing(4),
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    mainInfoContent: {
        position: 'relative',
        padding: theme.spacing(3),
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(6),
            paddingRight: 0,
        },
    },
}));

var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    autoplay: true
}

const MainInfo = (props) => {
    const classes = useStyles();
    const { mainInfo } = props;
    return (
        <Slider {...settings}>
            {mainInfo.images.map((image, i) =>
                <div key={i}>
                    <Paper className={classes.mainInfo} style={{ backgroundImage: `url(${image})` }}>
                        <React.Fragment>
                            {<img style={{ display: 'none' }} src={mainInfo.image} alt={mainInfo.imageText} />}
                            <div className={classes.overlay} />
                            <Grid container>
                                <Grid item md={6}>
                                    <div className={classes.mainInfoContent}>
                                        <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                                            {mainInfo.title}
                                        </Typography>
                                        <Typography variant="h5" color="inherit" paragraph>
                                            {mainInfo.description}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item md={6}>
                                    {mainInfo.actions}
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    </Paper>

                </div>
            )}
        </Slider>
    );
}

export default MainInfo