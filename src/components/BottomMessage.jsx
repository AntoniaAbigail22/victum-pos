import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const BottomMessage = ({ children }) => {
    return (
        <Box mt={2} width="full" position={'absolute'} left={10} className='animate-fadeIn'>
            <div className='fixed bottom-0 left-0 bg-slate-200 w-full p-1'>
                <Text fontSize="xs" fontWeight="thin" color="gray.600">
                    {children}
                </Text>
            </div>
        </Box>
    );
};

export default BottomMessage;