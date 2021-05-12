import React, { useState, useEffect, useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import AlbumIcon from '@material-ui/icons/Album'
import HelpIcon from '@material-ui/icons/Help'
import { useTranslation } from "react-i18next"
import { makeStyles } from '@material-ui/core/styles'
import { v4 as uuidv4 } from 'uuid'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { useSelector, useDispatch } from 'react-redux'

import { lpAutocompleteSearch, lpAutocompleteSearchClear } from '../../actions/lpActions'


const useStyles = makeStyles((theme) => ({
    albumThumb: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2),
    },
    helpBox: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.grey[200],
        height: '100%'
    },
    searchBox: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.primary[50],
    },
    helpIcon: {
        position: 'relative',
        float: 'right',
        marginTop: '5px',
        marginRight: '5px',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));

const SearchAlbum = ({ onSearchResultSelected, handleNext }) => {

    const dispatch = useDispatch()

    const [term, setTerm] = useState('')
    const [debouncedTerm, setDebouncedTerm] = useState(term)

    const lpAdd = useSelector((state) => state.lpAdd)
    const { searchResults, loading } = lpAdd.autocomplete

    //fem servir aquesta variable per evitar memory leaks quan el component ja no és visible
    const _isMounted = useRef(true);

    useEffect(() => {
        return () => { // equivalent a componentDidUnmount a components de classe
            _isMounted.current = false;
        }
    }, []);

    //Amb aquest hook es controlen els canvis del terme de cerca i nomès fem la crida al servei si ha passat mig segon sense canvis
    useEffect(() => {
        //Es crea una crida a la cerca amb un timeout de mig segon
        const timerId = setTimeout(() => {
            setDebouncedTerm(term)
        }, 500)

        //Cleanup: La proxima vegada que el terme de cerca canviï, s'executarà aquesta funció i es farà un clear del timeout anterior
        //d'aquesta manera evitem crides innecessaries al servei de cerca
        return () => {
            clearTimeout(timerId)
        }

    }, [term])

    //Amb aquest hook es controlen els canvis una vegada l'usuari deixa d'escriure i es fa la crida al servei de cerca
    useEffect(() => {
        const search = async () => {
            if (_isMounted.current) {
                dispatch(lpAutocompleteSearch(debouncedTerm))
            }
        }
        if (debouncedTerm)
            search()
        else {
            dispatch(lpAutocompleteSearchClear())
        }

    }, [debouncedTerm])


    //Render d'una opció del desplegable de resultats de la cerca
    const renderAlbumOption = (option) => {
        const parts = parse(option.name, match(option.name, term));

        return (
            <Grid container alignItems="center" id={uuidv4()}>
                <Grid item>
                    <Avatar variant="square" variant="rounded" alt={option.name} src={option.image[0]['#text']} className={classes.albumThumb}>
                        <AlbumIcon />
                    </Avatar>
                </Grid>
                <Grid item xs>
                    {parts.map((part, index) => (
                        //Resaltem les parts de text que coincideixen amb la cerca
                        <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                            {part.text}
                        </span>
                    ))}

                    <Typography variant="body2" color="textSecondary">
                        {option.artist}
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={0} className={classes.searchBox}>
                        <Typography variant="h6" gutterBottom>
                            {t('searchAlbum.title')}
                        </Typography>
                        <Autocomplete
                            loading={loading}
                            loadingText={t('searchAlbum.searching')}
                            style={{
                                backgroundColor: 'white'
                            }}
                            noOptionsText={t('form.noResults')}
                            id="suggest-album-title"
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                            filterOptions={(x) => x}
                            options={searchResults ? searchResults : []}
                            autoComplete
                            includeInputInList
                            filterSelectedOptions
                            getOptionSelected={(option, value) => option.name === value.name}
                            onChange={(event, newValue) => {
                                //callback al component superior per passar la opció seleccionada
                                onSearchResultSelected(newValue)
                            }}
                            onInputChange={(event, newInputValue) => {
                                setTerm(newInputValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label={t('searchAlbum.albumTitle')} variant="outlined" fullWidth />
                            )}
                            renderOption={(option) => renderAlbumOption(option)}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <HelpIcon className={classes.helpIcon} color='primary' />
                    <Paper elevation={0} className={classes.helpBox}>
                        <Typography variant="h6" gutterBottom>
                            {t('searchAlbum.helpTitle')}
                        </Typography>
                        <Typography>{t('searchAlbum.helpDescription')}</Typography>
                    </Paper>
                </Grid>
            </Grid>
            <div className={classes.buttons}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                >
                    {t('form.next')}
                </Button>
            </div>
        </React.Fragment>
    )
}

export default SearchAlbum
