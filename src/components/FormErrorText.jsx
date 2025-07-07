import React from 'react';
import { FormHelperText } from '@chakra-ui/react'

const FormErrorText = ({ label }) => <FormHelperText color={'red.500'}>{label ? label : 'Campo requerido'}</FormHelperText>;

export default React.memo(FormErrorText);