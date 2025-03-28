import React from 'react';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

const BreadcrumbHeader = ({
    links,
    isChecked,
    label
}) => {
    return (
        <Box width="100%">
            <Breadcrumb spacing='8px' px={1} separator={<ChevronRightIcon color='gray.500' />}>
                {links.map((item, index) => {
                    return (
                        <BreadcrumbItem key={`links-${item?.label}-${index}`}>
                            <BreadcrumbLink href={item.href || '#'}>{item?.label}</BreadcrumbLink>
                        </BreadcrumbItem>
                    )
                })
                }
            </Breadcrumb>
            <Text as="h1" fontSize="xl" color="blue.700" p={1} pt={0}>
                {label} {isChecked !== 'true' ? 'activos' : 'archivados'}
            </Text>
        </Box>
    );
};

export default BreadcrumbHeader;