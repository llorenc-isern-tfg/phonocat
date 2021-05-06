//TODO: esborrar si finalment es fa servir formik

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { useTranslation } from "react-i18next"

import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { useForm, FormProvider } from "react-hook-form";

import FormInput from "../shared/TextFieldController";
import { MenuItem, Select, TextField } from '@material-ui/core'

import { useFormContext, Controller } from "react-hook-form";

import { musicGenres, albumConditions, albumWeights } from '../../constants/selectCodes'
import TextFieldController from '../shared/TextFieldController'



const AlbumDetailsFormHooks = () => {

    const defaultValues = {
        genre: ''
    };


    const methods = useForm({ defaultValues })

    const { handleSubmit, reset, watch, control } = methods

    const lpPreload = useSelector((state) => state.lpPreload)


    const { t } = useTranslation(['translation', 'select', 'country'])


    const onSubmit = data => console.log(data)

    return (
        <React.Fragment >
            <FormProvider {...methods}>
                <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <Typography variant="h6" gutterBottom>
                        {t('LPDetail.title')}
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            {/* <Grid item xs={12} sm={6}>
                            <FormInput name="title" label="title" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormInput name="artist" label="artist" />
                        </Grid> */}

                            <Controller fullWidth
                                render={
                                    ({ field }) => <Select {...field}
                                        label={t('LPDetail.genre')}
                                    >
                                        {musicGenres.map((key) => (
                                            <MenuItem key={key} value={key}>
                                                {t(`select:musicGenre.${key}`)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                }
                                control={control}
                                name="genre"
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextFieldController control={control} name="title" label={t('LPDetail.albumTitle')} />

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
            </FormProvider>
        </React.Fragment >
    )
}

export default AlbumDetailsFormHooks
