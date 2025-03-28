import React from 'react';
import { Empty, Button } from 'antd';

const CustomEmpty = ({ onAddNew }) => {
    return (
        <Empty
            image={'https://img.icons8.com/fluency/96/000000/nothing-found.png'}
            description="No hay datos disponibles"
            imageStyle={{ height: 100, justifyContent: 'center', display: 'flex' }}
            className='h-[250px] flex flex-col justify-center align-middle'
        >
            <Button type="primary" onClick={onAddNew}>Agregar</Button>
        </Empty>
    );
};

export default CustomEmpty;