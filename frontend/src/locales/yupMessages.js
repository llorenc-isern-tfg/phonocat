//claus per traduïr els missatges de validació amb yup per defecte
import i18n from 'i18next'
const yupMessages = {
    mixed: {
        default: () => i18n.t('yup:field_invalid'),
        required: () => i18n.t('yup:required'),
        notType: ({ type }) => {
            const localeType = i18n.t(`yup:type.date`)
            return i18n.t('yup:invalid_type', { type: localeType })
        }
    },
    number: {
        min: ({ min }) => i18n.t('yup:number_too_low', { min }),  //({ min }) => (('yup:text_field_too_short', { min })),
        max: ({ max }) => i18n.t(('yup:number_too_high', { max })),
    },
    string: {
        email: () => i18n.t('yup:email'),
        min: ({ min }) => i18n.t('yup:text_field_too_short', { min }),  //({ min }) => (('yup:text_field_too_short', { min })),
        max: ({ max }) => i18n.t('yup:text_field_too_big', { max }),
    },
    date: {

    }
}

export default yupMessages