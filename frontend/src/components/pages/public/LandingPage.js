import React, { useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { useTranslation } from "react-i18next"

import MainInfo from '../../components/shared/MainInfo'
import mainInfoLogo from '../../../images/landing-background_1.jpg'

const LandingPage = () => {

    const { t } = useTranslation();

    const mainInfo = {
        title: t('landingPage.mainInfo.title'),
        description: t('landingPage.mainInfo.description'),
        image: mainInfoLogo,
        imgText: t('landingPage.mainInfo.imgText'),
    };

    return (
        // <React.Fragment>
        <Container maxWidth="lg">
            <MainInfo mainInfo={mainInfo} />
            <Typography paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
                facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
                gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
                donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
                Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
                imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
                arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
                donec massa sapien faucibus et molestie ac.
            </Typography>
        </Container>
        // </React.Fragment>
    )
}

export default LandingPage
