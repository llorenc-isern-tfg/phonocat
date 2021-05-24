import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import FilterListIcon from '@material-ui/icons/FilterList'
import i18n from 'i18next'
import NumberFormat from 'react-number-format'
import Avatar from '@material-ui/core/Avatar'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import TableFooter from '@material-ui/core/TableFooter'
import * as timeago from 'timeago.js'
import LinearProgress from '@material-ui/core/LinearProgress'
import Chip from '@material-ui/core/Chip'
import _ from 'lodash'

import { getListedItemsRequest, getListedItemsClear } from '../../actions/marketActions'
import defaultCoverImg from '../../images/lp_cover_default.png'
import { Button } from '@material-ui/core'
import timeagoMessages from '../../locales/timeagoMessages'
import FilterListedItemsDialog from '../../components/market/FilterListedItemsDialog'
import ListedItemDetailDialog from '../../components/market/ListedItemDetailDialog'

const useStyles = makeStyles((theme) => ({
    title: {
        flex: '1 1 100%',
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        // padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
        },
    },
    // cover: {
    //     display: 'inline-block',
    //     marginRight: theme.spacing(2)
    // },
    table: {
        minWidth: 400,
    },
    filterChip: {
        marginRight: theme.spacing(0.5)
    }
}))

const DEFAULT_ROWS_PER_PAGE = 10
const DEFAULT_SORT_BY = 'createdAt'
const DEFAULT_ORDER = 'desc'


const headCells = [
    { id: 'lp.title', numeric: false, disablePadding: false, label: i18n.t('lpDetail.albumTitle') },
    { id: 'lp.artist.name', numeric: false, disablePadding: false, label: i18n.t('lpDetail.artist') },
    { id: 'lp.genre', numeric: false, disablePadding: false, label: i18n.t('lpDetail.genre') },
    { id: 'createdAt', numeric: false, disablePadding: false, label: i18n.t('listedItems.published') },
    { id: 'wantedPrice', numeric: true, disablePadding: false, label: i18n.t('listedItems.wantedPrice') },
    { id: 'showItem', numeric: false, disablePadding: true },
]

timeago.register('messages', timeagoMessages)

const EnhancedTableHead = (props) => {
    const { classes, order, sortBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" />
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={sortBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={sortBy === headCell.id}
                            direction={sortBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const useStylesPagination = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

const CustomTablePagination = (props) => {
    const classes = useStylesPagination()
    const { page, onChangePage, pagination, loading } = props

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0)
    }

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1)
    }

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1)
    }

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, pagination.totalPages - 1)
    }

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={!pagination.hasPrevPage || loading}
                aria-label={i18n.t('pagination.firstPage')}
            >
                <FirstPageIcon />
            </IconButton>
            <IconButton onClick={handleBackButtonClick}
                disabled={page === 0 || loading}
                aria-label={i18n.t('pagination.prevPage')}>
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={!pagination.hasNextPage || loading}
                aria-label={i18n.t('pagination.nextPage')}>
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={!pagination.hasNextPage || loading}
                aria-label={i18n.t('pagination.lastPage')}>
                <LastPageIcon />
            </IconButton>
        </div>
    );
}

const ListedItemsPage = () => {

    const { listedItems, pagination, filterHelper, loading = true } = useSelector((state) => state.lpsForSale)

    const [order, setOrder] = useState(DEFAULT_ORDER)
    const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY)

    const [openDialog, setOpenDialog] = useState()
    const [filterOps, setFilterOps] = useState({})

    const [selectedItem, setSelectedItem] = useState({})

    const { t } = useTranslation()

    const dispatch = useDispatch()

    const classes = useStyles()

    //Quan es renderitza el component per primera vegada, carreguem el llistat de lps en venda amb els filtres i ordre per defecte
    useEffect(() => {
        fetchListedItems(pagination ? pagination.page : 0, DEFAULT_ROWS_PER_PAGE, sortBy, order)
        return () => dispatch(getListedItemsClear())
    }, [])

    const fetchListedItems = (page, limit, sortBy, sortOrder, filterParams) => {
        const fetchParams = {
            page,
            limit,
            sortBy,
            sortOrder
        }
        if (filterParams && filterParams.genre)
            fetchParams.genre = filterParams.genre
        if (filterParams && filterParams.priceRange) {
            fetchParams.minPrice = filterParams.priceRange[0]
            fetchParams.maxPrice = filterParams.priceRange[1]
        }

        dispatch(getListedItemsRequest(fetchParams))
    }

    const handleChangePage = (event, newPage) => {
        fetchListedItems(newPage, pagination.limit, sortBy, order, filterOps)
    }

    const handleRequestSort = (event, property) => {
        const isAsc = sortBy === property && order === 'asc'
        fetchListedItems(pagination.page - 1, pagination.limit, property, isAsc ? 'desc' : 'asc', filterOps)
        setOrder(isAsc ? 'desc' : 'asc');
        setSortBy(property)
    }

    const onCloseDialogHandler = () => {
        setOpenDialog(null)
    }

    const onClearFilterHandler = () => {
        onCloseDialogHandler()
        fetchListedItems(0, pagination.limit, sortBy, order, {})
        setFilterOps({})
    }

    const onFilterHandler = (newFilterOps) => {
        onCloseDialogHandler()
        fetchListedItems(0, pagination.limit, sortBy, order, newFilterOps)
        setFilterOps(newFilterOps)
    }

    const handleDeleteGenreFilter = () => {
        let newFilterOps = _.omit(filterOps, 'genre')
        fetchListedItems(0, pagination.limit, sortBy, order, newFilterOps)
        setFilterOps(newFilterOps)
    }

    const handleDeletePriceFilter = () => {
        let newFilterOps = _.omit(filterOps, 'priceRange')
        fetchListedItems(0, pagination.limit, sortBy, order, newFilterOps)
        setFilterOps(newFilterOps)
    }

    const filterDialogProps = {
        open: openDialog === 'filterDialog',
        handleClose: onCloseDialogHandler,
        handleClear: onClearFilterHandler,
        handleFilter: onFilterHandler,
        filterOps: filterOps,
        filterHelper: filterHelper ? {
            ...filterHelper,
            leastExpensive: Math.floor(filterHelper.leastExpensive),
            mostExpensive: Math.ceil(filterHelper.mostExpensive)
        } : {}
    }

    const listedItemDialogProps = {
        open: openDialog === 'itemDialog',
        listedItem: selectedItem,
        handleClose: onCloseDialogHandler
    }

    const handleOpenListedItemDialog = (listedItem) => {
        setSelectedItem(listedItem)
        setOpenDialog('itemDialog')
    }

    return (
        <React.Fragment >
            <Container maxWidth="xl">

                <TableContainer component={Paper} className={classes.paper}>
                    <Toolbar>
                        <Typography className={classes.title} color="inherit" variant="h6" component="div">
                            {t('listedItems.tableTitle')}
                        </Typography>
                        {filterOps && filterOps.genre &&
                            <Chip className={classes.filterChip} onDelete={handleDeleteGenreFilter}
                                label={t('listedItems.filter.genreActive', { genre: t(`select:musicGenre.${filterOps.genre}`) })} />}
                        {filterOps && filterOps.priceRange &&
                            <Chip className={classes.filterChip} onDelete={handleDeletePriceFilter}
                                label={t('listedItems.filter.priceActive', { min: filterOps.priceRange[0], max: filterOps.priceRange[1] })} />}
                        <Tooltip arrow title={t('listedItems.filter.filterTooltip')}>
                            <IconButton aria-label={t('listedItems.filterTooltip')} onClick={() => setOpenDialog('filterDialog')}>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                    {loading && <LinearProgress color="secondary" />}
                    <Table size="small" className={classes.table} aria-label="custom pagination table">
                        {listedItems.length > 0 ?
                            <React.Fragment>
                                <EnhancedTableHead
                                    classes={classes}
                                    order={order}
                                    sortBy={sortBy}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {
                                        listedItems.map((listedItem) => (
                                            <TableRow key={listedItem._id}>
                                                <TableCell component="th" scope="row">
                                                    <IconButton onClick={() => handleOpenListedItemDialog(listedItem)}>
                                                        <Avatar src={listedItem.lp.coverImg ? listedItem.lp.coverImg : defaultCoverImg}
                                                            variant="rounded"
                                                            className={classes.cover} />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {listedItem.lp.title}
                                                </TableCell>
                                                <TableCell>
                                                    {listedItem.lp.artist.name}
                                                </TableCell>
                                                <TableCell>
                                                    {t(`select:musicGenre.${listedItem.lp.genre}`)}
                                                </TableCell>
                                                <TableCell>
                                                    {timeago.format(listedItem.createdAt, 'messages')}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat
                                                        value={listedItem.wantedPrice} displayType={'text'}
                                                        thousandSeparator={i18n.t('currency.thousandSeparator')}
                                                        decimalSeparator={i18n.t('currency.decimalSeparator')}
                                                        decimalScale={2}
                                                        fixedDecimalScale
                                                        suffix="€"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button size="small" color="primary" onClick={() => handleOpenListedItemDialog(listedItem)}>
                                                        {t('listedItems.detail')}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[]}
                                            colSpan={7}
                                            count={pagination.totalItems}
                                            rowsPerPage={DEFAULT_ROWS_PER_PAGE}
                                            labelRowsPerPage={t('pagination.rowsPerPage')}
                                            page={pagination.page - 1}
                                            SelectProps={{
                                                inputProps: { 'aria-label': 'rows per page' },
                                                native: true,
                                            }}
                                            onChangePage={handleChangePage}
                                            ActionsComponent={(subprops) => <CustomTablePagination {...subprops} loading={loading} pagination={pagination} />}
                                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('pagination.of')} ${count}`}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center">
                                            {!loading && <Typography variant="subtitle2">{filterOps ? t('listedItems.emptyResults') : t('listedItems.emptyTable')}</Typography>}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </React.Fragment>
                        }
                    </Table>
                </TableContainer>
                {listedItems && !loading && (openDialog === 'filterDialog') && <FilterListedItemsDialog dialogProps={filterDialogProps} />}
                {selectedItem && !loading && (openDialog === 'itemDialog') && <ListedItemDetailDialog dialogProps={listedItemDialogProps} />}
            </Container>
        </React.Fragment >
    )
}

export default ListedItemsPage
