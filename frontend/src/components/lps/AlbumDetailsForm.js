import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Switch from '@material-ui/core/Switch'
import MomentUtils from '@date-io/moment'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers"
import { useTranslation } from "react-i18next"
import { useFormik } from 'formik'
import * as yup from 'yup'
import { setLocale } from 'yup'
import PublicIcon from '@material-ui/icons/Public'
import VpnLockIcon from '@material-ui/icons/VpnLock'
import Rating from '@material-ui/lab/Rating'

import yupMessages from '../../locales/yupMessages'
import { musicGenres, albumConditions, albumWeights } from '../../constants/selectCodes'
import countries from '../../constants/countries'

const useStyles = makeStyles((theme) => ({
    publicIcon: {
        marginRight: '5px'
    }
}))

const AlbumDetailsForm = ({ preloadedData }) => {

    const { t } = useTranslation(['translation', 'select', 'country'])
    const classes = useStyles()

    alert(preloadedData.year)

    const loginSchema = yup.object().shape({
        title: yup.string().required(),
        artist: yup.string().required(),
        year: yup.date().nullable(),
        numDiscs: yup.number().min(0).max(10),
        score: yup.number().min(0).max(5).nullable(),
        review: yup.string().max(1500)
    })


    const formik = useFormik({
        initialValues: {
            title: preloadedData.title ? preloadedData.title : '',
            artist: preloadedData.artist ? preloadedData.artist : '',
            label: preloadedData.label ? preloadedData.label : '',
            genre: preloadedData.genre ? preloadedData.genre : '',
            country: preloadedData.country ? preloadedData.country : '',
            year: preloadedData.year ? new Date(preloadedData.year, 0) : null,
            numDiscs: preloadedData.numDiscs ? preloadedData.numDiscs : '',
            condition: preloadedData.condition ? preloadedData.condition : '',
            weight: preloadedData.weight ? preloadedData.weight : '',
            stereo: preloadedData.stereo ? preloadedData.channel : true,
            score: preloadedData.score ? preloadedData.score : 0,
            review: preloadedData.review ? preloadedData.review : '',
            public: preloadedData.public ? preloadedData.public : false
        },
        validationSchema: loginSchema,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <React.Fragment>
            <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                <Typography variant="h6" gutterBottom>
                    {t('LPDetail.title')}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="title"
                            name="title"
                            label={t('LPDetail.albumTitle')}
                            fullWidth
                            value={formik.values.title}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="artist"
                            name="artist"
                            label={t('LPDetail.artist')}
                            fullWidth
                            value={formik.values.artist}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="label"
                            name="label"
                            label={t('LPDetail.discoLabel')}
                            fullWidth
                            value={formik.values.label}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="genre"
                            name="genre"
                            select
                            label={t('LPDetail.genre')}
                            fullWidth
                            value={formik.values.genre}
                            onChange={formik.handleChange("genre")}
                        >
                            {musicGenres.map((key) => (
                                <MenuItem key={key} value={key}>
                                    {t(`select:musicGenre.${key}`)}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            id="country"
                            options={countries}
                            getOptionLabel={(option) => t(`country:${option}`)}
                            value={formik.values.country}
                            onChange={(event, value) => formik.setFieldValue("country", value)}
                            renderInput={(params) => <TextField {...params} label={t('LPDetail.releaseCountry')} />}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker
                                fullWidth
                                id="year"
                                name="year"
                                views={["year"]}
                                label={t('LPDetail.releaseYear')}
                                value={formik.values.year}
                                onChange={(date) => formik.setFieldValue("year", date)}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
                            id="numDiscs"
                            name="numDiscs"
                            type="number"
                            label={t('LPDetail.numDiscs')}
                            // InputLabelProps={{
                            //     shrink: true
                            // }}
                            value={formik.values.numDiscs}
                            onChange={formik.handleChange}
                            InputProps={{ inputProps: { min: 1, max: 10 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="condition"
                            name="condition"
                            select
                            label={t('LPDetail.condition')}
                            value={formik.values.condition}
                            onChange={formik.handleChange("condition")}
                        >
                            {albumConditions.map((key) => (
                                <MenuItem key={key} value={key}>
                                    {t(`select:albumCondition.${key}`)}
                                </MenuItem>
                            ))}
                        </TextField>

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="weight"
                            name="weight"
                            select
                            label={t('LPDetail.weight')}
                            value={formik.values.weight}
                            onChange={formik.handleChange("weight")}
                        >
                            {albumWeights.map((key) => (
                                <MenuItem key={key} value={key}>
                                    {t(`select:albumWeight.${key}`)}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Grid item xs={12} sm={12}>
                            <InputLabel id="channel-label">{t('LPDetail.channel')}</InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography component="div">
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>Mono</Grid>
                                    <Grid item>
                                        <Switch
                                            checked={formik.values.stereo}
                                            onChange={(event) => {
                                                formik.setFieldValue("stereo", event.target.checked)
                                            }}
                                            color="primary"
                                            id="channel"
                                            name="channel"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </Grid>
                                    <Grid item>Stereo</Grid>
                                </Grid>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography component="legend">{t('LPDetail.score')}</Typography>
                        <Rating
                            id="score"
                            name="score"
                            value={formik.values.score}
                            onChange={(event, value) => {
                                formik.setFieldValue("score", value)
                            }}
                        />
                        <TextField
                            fullWidth
                            id="review"
                            name="review"
                            value={formik.values.review}
                            onChange={formik.handleChange}
                            placeholder={t('LPDetail.review')}
                            multiline
                            rows={4}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    name="public"
                                    value={formik.values.public}
                                    onChange={(event) => {
                                        formik.setFieldValue("public", event.target.checked ? true : false)
                                    }}
                                />}
                            labelPlacement="start"
                            label={
                                <React.Fragment>
                                    {formik.values.public ? <PublicIcon color="primary" className={classes.publicIcon} /> : <VpnLockIcon color="disabled" className={classes.publicIcon} />}
                                    {t('LPDetail.public')}
                                </React.Fragment>
                            }
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    PROVA SUBMIT
                            {/* Si es està fent login mostrem un spinner dins el botó */}
                    {/* {loading && <ButtonSpinner />} */}
                </Button>
            </form>
        </React.Fragment >
    )
}

export default AlbumDetailsForm
