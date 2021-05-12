import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import InputLabel from '@material-ui/core/InputLabel'
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
import _ from 'lodash'
import ConditionIcon from './ConditionIcon'


import yupMessages from '../../locales/yupMessages'
import { musicGenres, albumConditions, albumWeights } from '../../constants/selectCodes'
import countries from '../../constants/countries'
import TrackList from './TrackList'

const useStyles = makeStyles((theme) => ({
    publicIcon: {
        marginRight: '5px'
    }
}))

const LpForm = ({ lpData = {}, actions, handleSubmit }) => {

    const { t } = useTranslation(['translation', 'select', 'country'])
    setLocale(yupMessages)

    const classes = useStyles()

    const lpSchema = yup.object().shape({
        title: yup.string().required(),
        artist: yup.string().required(),
        genre: yup.string().required(),
        year: yup.date().nullable(),
        numDiscs: yup.number().min(1).max(15),
        rating: yup.number().min(0).max(5).nullable(),
        comment: yup.string().max(1500)
    })

    const formik = useFormik({
        initialValues: {
            title: lpData.title ? lpData.title : '',
            artist: lpData.artist ? (lpData.artist.name ? lpData.artist.name : lpData.artist) : '',
            label: lpData.label ? lpData.label : '',
            genre: lpData.genre ? lpData.genre : '',
            country: lpData.country && countries.includes(lpData.country) ? lpData.country : '',
            year: lpData.year ? new Date(lpData.year, 1) : null,
            numDiscs: lpData.numDiscs ? lpData.numDiscs : '',
            condition: lpData.condition ? lpData.condition : '',
            weight: lpData.weight ? lpData.weight : '',
            stereo: lpData.channel ? lpData.channel === 'stereo' : true,
            rating: lpData.review && lpData.review.rating ? lpData.review.rating : 0,
            comment: lpData.review && lpData.review.comment ? lpData.review.comment : '',
            isPublic: "isPublic" in lpData ? lpData.isPublic : true
        },
        validationSchema: lpSchema,
        onSubmit: values => {
            //recuperem els camps amb valors
            const lp = _.pickBy(values, _.identity);

            //convertim les dades al format de l'API
            if (lp.year) {
                lp.year = new Date(values.year).getFullYear()
            }

            if (lp.rating || lp.comment) {
                lp.review = {
                    rating: values.rating,
                    comment: values.comment
                }
                delete (lp.rating)
                delete (lp.comment)
            }

            lp.channel = lp.stereo ? 'stereo' : 'mono'
            delete lp.stereo

            if (lpData && lpData.trackList)
                lp.trackList = lpData.trackList

            lp.isPublic = lp.isPublic ? lp.isPublic : false

            handleSubmit(lp)

        },
    });

    return (
        <React.Fragment>
            <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                <Typography variant="h6" gutterBottom>
                    {t('lpDetail.title')}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="title"
                            name="title"
                            label={t('lpDetail.albumTitle')}
                            fullWidth
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="artist"
                            name="artist"
                            label={t('lpDetail.artist')}
                            fullWidth
                            value={formik.values.artist}
                            onChange={formik.handleChange}
                            error={formik.touched.artist && Boolean(formik.errors.artist)}
                            helperText={formik.touched.artist && formik.errors.artist}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="label"
                            name="label"
                            label={t('lpDetail.discoLabel')}
                            fullWidth
                            value={formik.values.label}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="genre"
                            name="genre"
                            select
                            label={t('lpDetail.genre')}
                            fullWidth
                            value={formik.values.genre}
                            onChange={formik.handleChange}
                            error={formik.touched.genre && Boolean(formik.errors.genre)}
                            helperText={formik.touched.genre && formik.errors.genre}
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
                            getOptionSelected={(option, value) => option === value}
                            getOptionLabel={(option) => t(`country:${option}`)}
                            value={formik.values.country}
                            onChange={(event, value) => formik.setFieldValue("country", value)}
                            renderInput={(params) => <TextField {...params} label={t('lpDetail.releaseCountry')} />}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker
                                fullWidth
                                id="year"
                                name="year"
                                views={["year"]}
                                label={t('lpDetail.releaseYear')}
                                value={formik.values.year}
                                onChange={(date) => formik.setFieldValue("year", date)}
                                error={formik.touched.year && Boolean(formik.errors.year)}
                                helperText={formik.touched.year && formik.errors.year}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
                            id="numDiscs"
                            name="numDiscs"
                            type="number"
                            label={t('lpDetail.numDiscs')}
                            // InputLabelProps={{
                            //     shrink: true
                            // }}
                            value={formik.values.numDiscs}
                            onChange={formik.handleChange}
                            InputProps={{ inputProps: { min: 1, max: 10 } }}
                            error={formik.touched.numDiscs && Boolean(formik.errors.numDiscs)}
                            helperText={formik.touched.numDiscs && formik.errors.numDiscs}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="condition"
                            name="condition"
                            select
                            label={t('lpDetail.condition')}
                            value={formik.values.condition}
                            onChange={formik.handleChange("condition")}
                        >
                            {albumConditions.map((condition) => (

                                <MenuItem key={condition} value={condition}>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <ConditionIcon condition={condition} />
                                        </Grid>
                                        <Grid item xs>
                                            {t(`select:albumCondition.${condition}`)}
                                        </Grid>
                                    </Grid>
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
                            label={t('lpDetail.weight')}
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
                            <InputLabel id="channel-label">{t('lpDetail.channel')}</InputLabel>
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
                        <Typography component="legend">{t('lpDetail.rating')}</Typography>
                        <Rating
                            id="rating"
                            name="rating"
                            value={formik.values.rating}
                            onChange={(event, value) => {
                                formik.setFieldValue("rating", value)
                            }}
                        />
                        <TextField
                            fullWidth
                            id="comment"
                            name="comment"
                            value={formik.values.comment}
                            onChange={formik.handleChange}
                            placeholder={t('lpDetail.comment')}
                            multiline
                            rows={4}
                            variant="outlined"
                            error={formik.touched.comment && Boolean(formik.errors.comment)}
                            helperText={formik.touched.comment && formik.errors.comment}
                        />
                    </Grid>
                    <Grid item xs={12}>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    name="isPublic"
                                    checked={formik.values.isPublic}
                                    onChange={(event) => {
                                        formik.setFieldValue("isPublic", event.target.checked ? true : false)
                                    }}
                                />}
                            labelPlacement="start"
                            label={
                                <React.Fragment>
                                    {formik.values.isPublic ? <PublicIcon color="primary" className={classes.publicIcon} /> : <VpnLockIcon color="disabled" className={classes.publicIcon} />}
                                    {t('lpDetail.public')}
                                </React.Fragment>
                            }
                        />
                    </Grid>
                    {lpData.trackList && lpData.trackList.length > 1 && <TrackList trackList={lpData.trackList} />}
                </Grid>
                {actions()}
            </form>
        </React.Fragment >
    )
}

export default LpForm
