import React from 'react'
import Container from '@material-ui/core/Container';
import { useTranslation } from "react-i18next";

import MainInfo from '../../components/MainInfo'
import mainInfoLogo from '../../images/landing-background_1.jpg'
import "../../locales/i18n";

const LandingPage = () => {

    const { t } = useTranslation();

    const mainInfo = {
        title: t('landingPage.mainInfo.title'),
        description: t('landingPage.mainInfo.description'),
        image: mainInfoLogo,
        imgText: t('landingPage.mainInfo.imgText'),
    };

    return (
        <React.Fragment>
            <Container maxWidth="lg">
                <MainInfo mainInfo={mainInfo} />
            </Container>
        </React.Fragment>
    )
}

export default LandingPage
