import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { useTranslation } from "react-i18next"
import Slider from '@material-ui/core/Slider'
import MenuItem from '@material-ui/core/MenuItem'
import FilterListIcon from '@material-ui/icons/FilterList'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import { musicGenres } from '../../constants/selectCodes'

const FilterListedItemsDialog = ({ dialogProps }) => {

    const { open, handleClose, handleClear, handleFilter, filterOps, filterHelper } = dialogProps

    const [priceRange, setPriceRange] = useState(filterOps.priceRange ?
        filterOps.priceRange
        :
        [filterHelper.leastExpensive, filterHelper.mostExpensive]
    )

    const [genre, setGenre] = useState(filterOps.genre ? filterOps.genre : '')

    const { t } = useTranslation()

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue)
    }

    const handleGenreChange = (event) => {
        setGenre(event.target.value);
    }

    const onClose = () => {
        setGenre(filterOps.genre ? filterOps.genre : '')
        setPriceRange(filterOps.priceRange ? filterOps.priceRange : [filterHelper.leastExpensive, filterHelper.mostExpensive])
        handleClose()
    }

    const onClear = () => {
        setGenre('')
        setPriceRange([filterHelper.leastExpensive, filterHelper.mostExpensive])
        handleClear()
    }

    const onFilter = () => {
        handleFilter({
            genre,
            priceRange
        })
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{t('listedItems.filter.title')}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {t('listedItems.filter.message')}
                </DialogContentText>
                <Grid container spacing={3} >
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="genre"
                            name="genre"
                            select
                            label={t('lpDetail.genre')}
                            fullWidth
                            value={genre}
                            onChange={handleGenreChange}
                        >
                            {musicGenres.map((key) => (
                                <MenuItem key={key} value={key}>
                                    {t(`select:musicGenre.${key}`)}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography id="range-slider" color="textSecondary" >
                            {`${t('listedItems.filter.priceRange')} ${priceRange[0]} - ${priceRange[1]} €`}
                        </Typography>
                        <Slider
                            value={priceRange}
                            min={0}
                            max={filterHelper.mostExpensive}
                            onChange={handlePriceRangeChange}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={(value) => `${value} €`}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" autoFocus>
                    {t('listedItems.filter.close')}
                </Button>
                <Button startIcon={<HighlightOffIcon />} onClick={onClear} color="secondary" variant="contained">
                    {t('listedItems.filter.clear')}
                </Button>
                <Button startIcon={<FilterListIcon />} onClick={onFilter} color="primary" variant="contained" autoFocus>
                    {t('listedItems.filter.filter')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default FilterListedItemsDialog
