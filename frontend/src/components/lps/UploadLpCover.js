import React, { useMemo, useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import UploadIcon from '@material-ui/icons/Backup'
import { useDropzone } from 'react-dropzone'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useTranslation } from "react-i18next"
import { useDispatch } from 'react-redux'
import { lpUploadCoverRequest } from '../../actions/lpActions'
import Container from '@material-ui/core/Container'
import { Link } from 'react-router-dom'
// import Image from 'material-ui-image'

const useStyles = makeStyles((theme) => ({
    coverImg: {
        height: 'auto',
        maxWidth: '100%',
        maxHeight: '400px'
    },
    infoBox: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.grey[100]
    },
    row: {
        marginBottom: 10
    },

    button: {
        margin: theme.spacing(1)
    },
    preview: {
        width: 100,
        height: 100,
        maxWidth: 100,
    },
    previewMedia: {
        height: 100,
    }
}));

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fff',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
}

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const UploadLpCover = ({ lpProps }) => {

    const { id, cover } = lpProps
    const dispatch = useDispatch()

    const [suggestCover, setSuggestCover] = useState(cover)
    const [selectedFile, setSelectedFile] = useState()

    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: 'image/*', multiple: false,
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0)
                setSelectedFile(
                    {
                        file: acceptedFiles[0],
                        preview: URL.createObjectURL(acceptedFiles[0])
                    }
                )
        }
    })

    useEffect(() => () => {
        selectedFile && URL.revokeObjectURL(selectedFile.preview)
    }, [selectedFile])

    const renderPreview = () => {

        return selectedFile && (
            <>
                <Card className={classes.preview}>
                    <CardMedia
                        className={classes.previewMedia}
                        height="100"
                        image={selectedFile.preview}
                    />
                </Card>
            </>
        )
    }

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ])

    const uploadSuggestedCover = async () => {
        var formData = new FormData()
        formData.append('cover', cover)
        formData.append('method', 'url')
        dispatch(lpUploadCoverRequest({ id, formData }))
    }

    const uploadFileCover = () => {
        var formData = new FormData()
        formData.append('cover', acceptedFiles[0])
        formData.append('method', 'file')
        dispatch(lpUploadCoverRequest({ id, formData }))
    }

    const classes = useStyles()
    const { t } = useTranslation();

    const renderSuggestCover = () => {
        return (
            <Grid item xs={12} sm={12}>
                <Paper elevation={0} className={classes.infoBox} >
                    <Typography gutterBottom className={classes.row}>
                        {t('lpCover.suggested')}
                    </Typography>
                    {/* {cover &&
                        <Image src={cover} imageStyle={{
                            height: 'auto',
                            maxWidth: '100%',
                            maxHeight: '400px',
                        }} draggable="false" />} */}
                    {cover &&
                        <Grid item xs={12}>
                            <img alt="cover" src={cover} className={classes.coverImg} />
                        </Grid>
                    }
                    <Grid item xs={12} className={classes.row}>
                        <Button variant="contained" color="default" className={classes.button}
                            onClick={() => setSuggestCover(false)}>
                            {t('lpCover.discard')}
                        </Button>
                        <Button variant="contained" color="primary" startIcon={<UploadIcon />} className={classes.button}
                            onClick={uploadSuggestedCover}>
                            {t('lpCover.upload')}
                        </Button>
                    </Grid>
                </Paper>
            </Grid>
        )
    }

    const renderUploadCover = () => {
        return (
            <Grid item xs={12} >
                <Typography gutterBottom className={classes.row}>
                    {t('lpCover.notMandatory')}
                </Typography>
                <Paper elevation={0} className={classes.infoBox} >
                    <Box className={classes.container}>
                        <FormControl error={fileRejections.length > 0} fullWidth>
                            <Box {...getRootProps({ style })}>
                                <input {...getInputProps()} />
                                <UploadIcon fontSize="large" />
                                <Typography>{t('form.dragFile')}</Typography>
                                {renderPreview()}
                            </Box>
                            <FormHelperText id="component-helper-text">{fileRejections.length > 0 && t('lpCover.invalidFile')}</FormHelperText>
                        </FormControl>
                    </Box>
                    <Grid item xs={12} className={classes.row}>
                        <Button variant="contained" color="default" className={classes.button}
                            component={Link} to="/lp/collection/">
                            {t('form.exit')}
                        </Button>
                        <Button variant="contained" color="primary" disabled={acceptedFiles.length === 0} startIcon={<UploadIcon />} className={classes.button}
                            onClick={uploadFileCover}>
                            {t('lpCover.upload')}
                        </Button>
                    </Grid>
                </Paper>
            </Grid>
        )
    }

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Container maxWidth='md'>
                    <Grid item xs={12} className={classes.row}>
                        <Typography variant="h6" className={classes.almostThere}>
                            {t('lpCover.almostThere')}
                        </Typography>
                    </Grid>
                    {
                        suggestCover ? renderSuggestCover() : renderUploadCover()
                    }
                </Container>
            </Grid>
        </React.Fragment>

    )
}

export default UploadLpCover
