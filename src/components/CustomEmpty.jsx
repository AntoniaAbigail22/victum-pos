import React from 'react';
import { Empty, Button } from 'antd';

const CustomEmpty = ({ onAddNew }) => {
    return (
        <Empty
            image={'https://maxst.icons8.com/vue-static/threedio/errors/not-found.png'}
            description="No hay datos disponibles"
            imageStyle={{ height: 150, justifyContent: 'center', display: 'flex' }}
            className='h-[250px] flex flex-col justify-center align-middle'
            loading="lazy"
        >
            <Button type="primary" onClick={onAddNew}>Agregar</Button>
        </Empty>
    );
};

export default CustomEmpty;