import React from 'react'
import AudiotrackIcon from '@material-ui/icons/Audiotrack'
import { makeStyles } from '@material-ui/core/styles'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import QueueMusicIcon from '@material-ui/icons/QueueMusic'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useTranslation } from "react-i18next"
import { withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}))

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);


const TrackList = ({ trackList }) => {

    const { t } = useTranslation()
    const classes = useStyles()

    return (
        < Grid item xs={12} >
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="tracklist-content"
                    id="tracklist-header"
                >
                    <QueueMusicIcon color="disabled" />&nbsp;<Typography className={classes.heading}>{t('tracklist.header')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer component={Paper} elevation={0}>
                        <Table className={classes.table} aria-label="simple table" size="small" >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">{t('tracklist.title')}</TableCell>
                                    <TableCell align="right">{t('tracklist.position')}</TableCell>
                                    <TableCell align="right">{t('tracklist.duration')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trackList.map((track, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            <Grid container wrap="nowrap">
                                                <Grid item>
                                                    <AudiotrackIcon color="disabled" />
                                                </Grid>
                                                <Grid item xs zeroMinWidth>
                                                    {track.title}
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell align="right">{track.position}</TableCell>
                                        <TableCell align="right">{track.duration}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>
        </Grid >
    )
}

export default TrackList
