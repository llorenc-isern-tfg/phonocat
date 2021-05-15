import React from 'react'

const UserDetailsPage = () => {
    return (
        <React.Fragment>
            {user &&
                <Container maxWidth="lg">
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            <PersonIcon fontSize="large" color="primary" /> {t('profile.title')}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            {t('profile.picture')}
                        </Typography>
                        <Grid container spacing={3} style={{ marginBottom: 5 }}>
                            <Grid item xs={12} sm={6}>
                                <Card className={classes.pictureCard} elevation={4}>
                                    <div className={classes.wrapper}>
                                        <CardMedia className={classes.pictureCardMedia}
                                            image={pictureImg ? pictureImg : blankProfile}
                                        />
                                        <Backdrop className={classes.pictureBackdrop} open={loadingPicture}>
                                            <CircularProgress color="inherit" />
                                        </Backdrop>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DropImage label={t('profile.editPicture')} onUpload={uploadPicture} />
                            </Grid>
                        </Grid>
                        <React.Fragment>
                            <ProfileForm userData={user} actions={actions} handleSubmit={handleSubmit} />
                        </React.Fragment>
                    </Paper>
                    {/* <Backdrop className={classes.backdrop} open={(status && status.loading) ? status.loading : false}>
                    <CircularProgress color="inherit" />
                </Backdrop> */}
                </Container>
            }
        </React.Fragment >
    )
}

export default UserDetailsPage
