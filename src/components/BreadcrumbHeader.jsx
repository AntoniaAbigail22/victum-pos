import React from 'react';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import { useNavigate } from 'react-router-dom';

const BreadcrumbHeader = ({
    links,
    isChecked,
    label
}) => {
    const navigate = useNavigate();
    return (
        <Box width="100%" style={{ marginTop: 8 }}>
            <Breadcrumb spacing='8px' px={1} separator={<ChevronRightIcon color='gray.500' />}>
                {links.map((item, index) => {
                    return (
                        <BreadcrumbItem key={`links-${item?.label}-${index}`}>
                            <BreadcrumbLink
                                onClick={(e) => {
                                    if (item?.goBack) {
                                        e.preventDefault();
                                        navigate(-1);
                                    }
                                }}
                                href={item.href || '#'}
                            >
                                {item?.label}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    )
                })
                }
            </Breadcrumb>
        </Box>
    );
};

export default BreadcrumbHeader;