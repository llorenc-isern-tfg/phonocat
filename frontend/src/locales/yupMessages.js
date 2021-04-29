//claus per traduïr els missatges de validació amb yup per defecte
import i18n from "i18next";
const yupMessages = {
    mixed: {
        default: () => i18n.t('yup.field_invalid'),
        required: () => i18n.t('yup.required')
    },
    string: {
        email: () => i18n.t('yup.email'),
        min: ({ min }) => i18n.t('yup.text_field_too_short', { min }),  //({ min }) => (('yup.text_field_too_short', { min })),
        max: ({ max }) => i18n.t(('yup.text_field_too_big', { max })),
    }
}

export default yupMessages