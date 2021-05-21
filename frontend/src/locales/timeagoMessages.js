//claus per traduïr els missatges de validació amb yup per defecte
import i18n from 'i18next'
const timeagoMessages = function (number, index, totalSec) {
    // number: the time ago / time in number;
    // index: the index of array below;
    // totalSec: total seconds between date to be formatted and today's date;
    return [
        [i18n.t('timeago:justNow'), i18n.t('timeago:rightNow')],
        [i18n.t('timeago:nSecondsAgo', { s: number }), i18n.t('timeago:inNSeconds', { s: number })],
        [i18n.t('timeago:aMinutAgo'), i18n.t('timeago:inAMinut')],
        [i18n.t('timeago:nMinutesAgo', { s: number }), i18n.t('timeago:inNMinutes', { s: number })],
        [i18n.t('timeago:anHourAgo'), i18n.t('timeago:inAnHour')],
        [i18n.t('timeago:nHoursAgo', { s: number }), i18n.t('timeago:inNHours', { s: number })],
        [i18n.t('timeago:aDayAgo'), i18n.t('timeago:inADay')],
        [i18n.t('timeago:nDaysAgo', { s: number }), i18n.t('timeago:inNDays', { s: number })],
        [i18n.t('timeago:aWeekAgo'), i18n.t('timeago:inAWeek')],
        [i18n.t('timeago:nWeeksAgo', { s: number }), i18n.t('timeago:inNWeeks', { s: number })],
        [i18n.t('timeago:aMonthAgo'), i18n.t('timeago:inAMonth')],
        [i18n.t('timeago:nMonthsAgo', { s: number }), i18n.t('timeago:inNMonths', { s: number })],
        [i18n.t('timeago:aYearAgo'), i18n.t('timeago:inAYear')],
        [i18n.t('timeago:nYearsAgo', { s: number }), i18n.t('timeago:inNYears', { s: number })],
    ][index];
}

export default timeagoMessages