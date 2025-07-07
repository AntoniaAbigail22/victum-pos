import React from 'react';
import { Code } from "@chakra-ui/react";

const Codes = ({ label, sub }) => <> <Code fontWeight="bold" colorScheme='blackAlpha'>{label}</Code> {sub && sub} </>;

export default React.memo(Codes);