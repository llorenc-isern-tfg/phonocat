import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import TextField from "@material-ui/core/TextField";

function TextFieldController(props) {
    const { name, label, variant = 'outlined' } = props;

    const { control } = useFormContext()


    return (
        <Controller render={({ field }) => (
            <TextField {...field}
                name={name}
                control={control}
                defaultValue=""
                label={label}
                fullWidth
                {...props}
            />
        )}
        />

        // <Controller
        //     render={({ field: { onChange, value }, fieldState: { error } }) => (
        //         <TextField
        //             variant={variant}
        //             name={name}
        //             label={label}
        //             control={control}
        //             onChange={onChange}
        //             error={!!error}
        //             helperText={error ? error.message : null}
        //         />
        //     )}
        //     rules={{ required: 'First name required' }}
        // />
    )
}

export default TextFieldController