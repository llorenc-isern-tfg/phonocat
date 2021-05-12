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
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { useTranslation } from "react-i18next"
import { useFormik } from 'formik'
import * as yup from 'yup'
import { setLocale } from 'yup'
import PublicIcon from '@material-ui/icons/Public'
import VpnLockIcon from '@material-ui/icons/VpnLock'
import Rating from '@material-ui/lab/Rating'
import _ from 'lodash'
import MuiPhoneNumber from 'material-ui-phone-number'
import moment from 'moment';


import yupMessages from '../../locales/yupMessages'
import languages from '../../constants/languages'
import countries from '../../constants/countries'
import { FormControl } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    username: {
        textTransform: 'capitalize'
    }
}))

const ProfileForm = ({ userData = {}, actions, handleSubmit }) => {

    const { t } = useTranslation(['translation', 'select', 'country'])
    setLocale(yupMessages)

    const classes = useStyles()

    const userSchema = yup.object().shape({
        birthDate: yup.date().nullable(),
        phoneNumber: yup.string(),
        bio: yup.string().max(1500),
        region: yup.string(),
        city: yup.string(),
        postalCode: yup.number(),
    })

    const formik = useFormik({
        initialValues: {
            birthDate: userData.birthDate ? userData.birthDate : null,
            phoneNumber: userData.phoneNumber ? userData.phoneNumber : '',
            bio: userData.bio ? userData.bio : '',
            language: userData.language ? userData.language : 'ca',
            country: userData.country ? userData.country : '',
            // region: userData.address ? userData.region : '',
            // city: userData.address ? userData.city : '',
            // postalCode: userData.address ? userData.city : '',
        },
        validationSchema: userSchema,
        onSubmit: values => {
            //recuperem els camps amb valors
            const userFormData = _.pickBy(values, _.identity)
            handleSubmit(userFormData)
        },
    });

    return (
        <React.Fragment>
            <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <Typography variant="h6" gutterBottom>
                        {t('profile.userData')}
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2">{t('profile.username')}:</Typography>
                            <Typography className={classes.username} >{userData.username}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2">{t('profile.email')}:</Typography>
                            <Typography >{userData.email}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2">{t('profile.registerDate')}:</Typography>
                            <Typography >{moment(userData.createdAt).format('MM/DD/YYYY')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="language"
                                name="language"
                                select
                                label={t('profile.language')}
                                fullWidth
                                value={formik.values.language}
                                onChange={formik.handleChange}
                                error={formik.touched.language && Boolean(formik.errors.language)}
                                helperText={formik.touched.language && formik.errors.language}
                            >
                                {languages.map((lang) => (
                                    <MenuItem key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <KeyboardDatePicker
                                name="birthDate"
                                id="birthDate"
                                label={t('profile.birthDate')}
                                format="DD/MM/yyyy"
                                value={formik.values.birthDate}
                                onChange={(date) => formik.setFieldValue("birthDate", date)}
                                error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
                                helperText={formik.touched.birthDate && formik.errors.birthDate}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormControl>
                                <MuiPhoneNumber
                                    // defaultCountry={userData.country ? userData.country.toLowerCase() : 'es'}
                                    // regions={'europe'}
                                    name="phoneNumber"
                                    label={t('profile.phoneNumber')}
                                    localization={{}}//TODO: traduir paisos
                                    value={formik.values.phoneNumber}
                                    onChange={(phoneNumber) => formik.setFieldValue("phoneNumber", phoneNumber)}
                                />
                            </FormControl >
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                id="country"
                                options={countries}
                                getOptionSelected={(option, value) => option === value}
                                getOptionLabel={(option) => t(`country:${option}`)}
                                value={formik.values.country}
                                onChange={(event, value) => formik.setFieldValue("country", value)}
                                renderInput={(params) => <TextField {...params} label={t('profile.country')} />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography component="legend">{t('profile.bioLabel')}</Typography>
                            <TextField
                                fullWidth
                                id="bio"
                                name="bio"
                                value={formik.values.bio}
                                onChange={formik.handleChange}
                                placeholder={t('profile.bio')}
                                multiline
                                rows={4}
                                variant="outlined"
                                error={formik.touched.bio && Boolean(formik.errors.bio)}
                                helperText={formik.touched.bio && formik.errors.bio}
                            />
                        </Grid>
                    </Grid>
                    {/* <Typography variant="h6" >
                        {t('profile.address')}
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                id="country"
                                options={countries}
                                getOptionSelected={(option, value) => option === value}
                                getOptionLabel={(option) => t(`country:${option}`)}
                                value={formik.values.country}
                                onChange={(event, value) => formik.setFieldValue("country", value)}
                                renderInput={(params) => <TextField {...params} label={t('profile.country')} />}
                            />
                        </Grid>
                    </Grid> */}
                    {actions()}
                </MuiPickersUtilsProvider>
            </form>
        </React.Fragment >
    )
}

export default ProfileForm
