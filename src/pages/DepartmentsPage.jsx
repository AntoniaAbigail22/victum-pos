import React from 'react';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import CategoryTable from '../components/CategoryTable';

const DepartmentsPage = () => {
  return (
    <Box p={4}>
      <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} mb={4}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/inventory">Inventario</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Departamentos</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <CategoryTable />
    </Box>
  );
};

export default DepartmentsPage;