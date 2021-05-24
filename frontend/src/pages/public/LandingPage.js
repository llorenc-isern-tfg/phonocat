import React, { useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { useTranslation } from "react-i18next"
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Grid from '@material-ui/core/Grid'
import StarIcon from '@material-ui/icons/StarBorder'
import i18n from 'i18next'
import ShareIcon from '@material-ui/icons/Share'
import AlbumIcon from '@material-ui/icons/Album'
import PaymentIcon from '@material-ui/icons/Payment'



import MainInfo from '../../components/shared/MainInfo'
import background1 from '../../images/landing-background_1.jpg'
import background2 from '../../images/landing-background_2.jpg'
import background3 from '../../images/landing-background_3.jpg'
import "../../locales/i18n"
import history from '../../history'
import { REGISTER_DIALOG_ID } from '../../constants/constants'


const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
        li: {
            paddingBottom: theme.spacing(2)
        }
    },
    rootContainer: {
        marginTop: theme.spacing(5)
    },
    cardContainer: {
        paddingBottom: theme.spacing(5)
    },
    cardHeader: {
        backgroundColor: theme.palette.primary[50],
    },
    cardFunc: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),
    },
    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    }
}))


const handleUserAuth = () => {
    history.push('/lp/collection')
}


const LandingPage = ({ handleChangeDialog }) => {
    const auth = useSelector((state) => state.auth)
    const { userInfo } = auth

    useEffect(() => {
        if (userInfo)
            handleUserAuth()
    }, [userInfo])

    const { t } = useTranslation()

    const tiers = [
        {
            title: t('landingPage.share'),
            icon: <ShareIcon fontSize="large" />,
            description: [
                t('landingPage.share1'),
                t('landingPage.share2'),
                t('landingPage.share3'),
            ]
        },
        {
            title: t('landingPage.catalogue'),
            icon: <AlbumIcon fontSize="large" />,
            description: [
                t('landingPage.catalogue1'),
                t('landingPage.catalogue2'),
                t('landingPage.catalogue3'),
            ]
        },
        {
            title: t('landingPage.sell'),
            icon: <PaymentIcon fontSize="large" />,
            description: [
                t('landingPage.sell1'),
                t('landingPage.sell2'),
                t('landingPage.sell3'),
            ]
        },
    ];

    const mainInfo = {
        title: t('landingPage.mainInfo.title'),
        description: t('landingPage.mainInfo.description'),
        images: [background1, background2, background3],
        image: background1,
        imgText: t('landingPage.mainInfo.imgText'),
    };

    const classes = useStyles()

    return (
        <Container maxWidth="lg" className={classes.rootContainer}>
            <MainInfo mainInfo={mainInfo} />

            <Container maxWidth="md" className={classes.cardContainer}>
                <Grid container spacing={5} alignItems="flex-end">
                    {tiers.map((tier) => (
                        <Grid item key={tier.title} xs={12} sm={6} md={4}>
                            <Card>
                                <CardHeader
                                    title={tier.title}
                                    subheader={tier.subheader}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{ align: 'center' }}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    <div className={classes.cardFunc}>
                                        <Typography component="h2" variant="h3" color="secondary">
                                            {tier.icon}
                                        </Typography>
                                    </div>
                                    <ul>
                                        {tier.description.map((line) => (
                                            <Typography component="li" variant="subtitle1" align="center" key={line}>
                                                {line}
                                            </Typography>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardActions>
                                    <Button fullWidth variant={tier.buttonVariant} color="primary">
                                        {tier.buttonText}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Container maxWidth="xs">
                <Grid container justify="center"
                    alignItems="center">
                    <Grid item>
                        <Button fullWidth color="primary" variant="contained" onClick={() => handleChangeDialog(REGISTER_DIALOG_ID)}>{t('landingPage.join')}</Button>
                    </Grid>
                </Grid>
            </Container>
            <footer className={classes.footer}>
                <Container maxWidth="lg">
                    <Typography variant="h6" align="center" gutterBottom>
                        {t('footer.title')}
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                        {t('footer.desc')}
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                        {t('footer.desc2')}
                    </Typography>
                </Container>
            </footer>

        </Container>
    )
}

export default LandingPage
