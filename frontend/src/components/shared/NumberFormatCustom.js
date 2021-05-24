import React from 'react'
import i18n from 'i18next'
import NumberFormat from 'react-number-format'

const NumberFormatCustom = (props) => {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator={i18n.t('currency.thousandSeparator')}
            decimalSeparator={i18n.t('currency.decimalSeparator')}
            allowLeadingZeros={false}
            allowNegative={false}
            decimalScale={2}
            isNumericString
            suffix="€"
        />
    );
}

export default NumberFormatCustom
