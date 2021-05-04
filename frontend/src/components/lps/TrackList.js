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
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useTranslation } from "react-i18next"
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme) => ({
    publicIcon: {
        marginRight: '5px'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}))


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
                    <Typography className={classes.heading}>{t('tracklist.header')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">{t('tracklist.title')}</TableCell>
                                    <TableCell align="right">{t('tracklist.position')}</TableCell>
                                    <TableCell align="right">{t('tracklist.duration')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trackList.map((track) => (
                                    <TableRow key={track.title}>
                                        <TableCell component="th" scope="row">
                                            <Grid container direction="row" alignItems="center">
                                                <Grid item>
                                                    <AudiotrackIcon />
                                                </Grid>
                                                <Grid item>
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

// const renderTrackList = (trackList) => {
//     if (trackList && trackList.length > 1)
//         return (
//             < Grid item xs={12} >
//                 <Accordion>
//                     <AccordionSummary
//                         expandIcon={<ExpandMoreIcon />}
//                         aria-controls="tracklist-content"
//                         id="tracklist-header"
//                     >
//                         <Typography className={classes.heading}>Tracklist</Typography>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                         <List aria-label="tracklist songs" style={{ width: '100%' }}>
//                             {trackList.map((track) => (
//                                 <>
//                                     <ListItem >
//                                         <ListItemIcon>
//                                             <AudiotrackIcon />
//                                         </ListItemIcon>
//                                         <ListItemText primary={track.title} secondary={`${track.position} - ${track.duration}`} />
//                                     </ListItem>
//                                     <Divider />
//                                 </>
//                             ))}
//                         </List>
//                     </AccordionDetails>
//                 </Accordion>
//             </Grid >
//         )
//     else
//         return null
// }

export default TrackList
