import React from 'react';
import { FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import FormErrorText from './FormErrorText';


const FormInputField = ({ label, placeholder, name, formData, errors, onChange, type = "text", required = true, label_error, row, options }) => {
    return (
        <FormControl isInvalid={!!errors?.[name]}>
            <div className={`flex ${row ? 'flex-row gap-1 items-end' : 'flex-col'} `}>
                <FormLabel className={`text-sm font-semibold text-gray-700 flex flex-col ${row ? 'min-w-[170px]' : ''}`}>
                    {label}{required && <span className='text-red-500 pl-0.5'>*</span>}
                </FormLabel>
                {options && options.length > 0 ? (
                    <Select
                        name={name}
                        value={formData?.[name]}
                        //onChange={onChange}
                        onChange={(e) => {
                            const selected = options.find(opt => opt.id === e.target.value);
                            console.log("🚀 ~ FormInputField ~ selected:", selected)
                            onChange({ target: { name, value: selected?.id } });
                        }}
                        className="border border-gray-300 rounded-md p-2"
                        placeholder='Seleccionar un elemento'
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option?.id}>
                                {option?.name}
                            </option>
                        ))}
                    </Select>
                ) :
                    <Input
                        name={name}
                        value={formData?.[name]}
                        onChange={onChange}
                        placeholder={placeholder || label}
                        type={type}
                    />

                }
            </div>

            {errors?.[name] && <FormErrorText label={label_error} />}
        </FormControl>
    );
};

export default FormInputField;