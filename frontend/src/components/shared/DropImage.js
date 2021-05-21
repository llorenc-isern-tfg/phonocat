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

const useStyles = makeStyles((theme) => ({
    previewContainer: {
        display: 'flex'
    },
    preview: {
        width: 100,
        height: 100,
        maxWidth: 100,
    },
    previewMedia: {
        height: 100,
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

const DropImage = ({ label, onUpload, discardAction, maxFiles, onDropHandle }) => {

    const [selectedFiles, setSelectedFiles] = useState([])

    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: 'image/*',
        multiple: maxFiles && maxFiles > 1,
        maxFiles,
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0) {
                const files = acceptedFiles.map((acceptedFile) => {
                    return {
                        file: acceptedFile,
                        preview: URL.createObjectURL(acceptedFile)
                    }
                })
                setSelectedFiles(files)
            }
            if (onDropHandle)
                onDropHandle(acceptedFiles)
        }
    })

    useEffect(() => () => {
        if (selectedFiles)
            selectedFiles.map((file) => URL.revokeObjectURL(file.preview))
    }, [selectedFiles])

    const renderPreview = (i) => {
        // console.log(preview, i)
        return selectedFiles[i] && < React.Fragment key={i} >
            <Card className={classes.preview}>
                <CardMedia
                    className={classes.previewMedia}
                    height="100"
                    image={selectedFiles[i].preview}
                />
            </Card>
        </React.Fragment >
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

    const classes = useStyles()
    const { t } = useTranslation();

    const uploadFiles = () => {
        if (selectedFiles)
            onUpload(maxFiles && maxFiles > 1 ?
                selectedFiles.map(selectedFile => selectedFile.file)
                :
                selectedFiles[0].file)
    }

    return (
        <React.Fragment>
            <Typography gutterBottom className={classes.row}>
                {label}
            </Typography>
            <Paper elevation={0} className={classes.infoBox} >
                <Box className={classes.container}>
                    <FormControl error={fileRejections.length > 0} fullWidth>
                        <Box {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            <UploadIcon fontSize="large" />
                            <Typography>{t('dropImage.dragFile', { count: maxFiles })}</Typography>
                            <Box component="div" className={classes.previewContainer}>
                                {selectedFiles.map((file, i) => renderPreview(i))}
                            </Box>
                        </Box>
                        <FormHelperText id="component-helper-text">
                            {fileRejections.length > 0 && t('dropImage.invalidFile', { count: fileRejections.length, max: maxFiles })}
                        </FormHelperText>
                    </FormControl>
                </Box>
                {onUpload &&
                    <Grid item xs={12} className={classes.row}>
                        {discardAction}
                        <Button variant="contained" color="primary" disabled={acceptedFiles.length == 0} startIcon={<UploadIcon />} className={classes.button}
                            onClick={uploadFiles}>
                            {t('lpCover.upload')}
                        </Button>
                    </Grid>
                }
            </Paper>
        </React.Fragment>
    )
}

export default DropImage
