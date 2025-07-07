import { createClient } from "@supabase/supabase-js";
const titleError = 'Error'
const messageError = 'Hubo un problema al enviar los datos. Por favor, inténtalo de nuevo.'
const messageWarning = 'Advertencia'
const success = 'Operación éxitosa'

const supabaseUrl = "https://qcrozwyackutepuqqwji.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjcm96d3lhY2t1dGVwdXFxd2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MzIzNjUsImV4cCI6MjA1NTQwODM2NX0.C7ooL9Ve3jLGFhtCk0jfNohE_nkUe2nkpIh_CWrlx-E";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const messagesNotification = {
    success: {
        message: `${success}`,
    },
    error: {
        message: titleError,
        description: messageError,
    },
    warning: {
        message: messageWarning
    },
    info: {
        message: "Recuerda revisar todos los campos antes de continuar"
    }
}

export const headers1 = {
    'Content-Type': 'application/pdf',
}

export const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8; multipart/form-data"
};

export const headers2 = {
    "Accept": "application/json",
    "Content-Type": "multipart/form-data"
};



export const openNotification = (api, type, description) => {
    api[type]({
        message: messagesNotification[type].message,
        description: description || messagesNotification[type].description,
    });
};

const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\d{10}$/;

export const validateEmail = email => emailRegex.test(email);
export const validatePhone = phone => phoneRegex.test(phone);

export const validateErrors = keys => {
    const newErrors = keys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
    }, {});
    return newErrors;
}

export const validateLabelErrors = (keys, form) => {
    const newErrors = keys.reduce((acc, key) => {
        acc[key] = !form[key];
        return acc;
    }, {});
    return newErrors;
}

export const getLabelTypePeople = (type) => {
    switch (type) {
        case 1:
            return 'Proveedor';
        case 2:
            return 'Empleado';
        case 3:
            return 'Gerente';
        case 4:
            return 'Cliente';
        default:
            return '';
    }
}

export const getLabelTypeDirectory = {
    1: 'PROVEEDOR',
    2: 'EMPLEADO',
    3: 'GERENTE',
    4: 'CLIENTE',
}

export const getTitleDirectory = {
    1: 'Proveedores',
    2: 'Empleados',
    3: 'Gerentes',
    4: 'Clientes',
}


export const getLabelTypeInventory = {
    1: 'PRODUCTO',
    2: 'ALMACÉN',
    3: 'CATEGORÍA',
    4: 'MOVIMIENTO',
}

export const getTitleInventory = {
    1: 'Productos',
    2: 'Almacenes',
    3: 'Categorías',
    4: 'Movimientos',
    5: 'Movimientos',
}

export const DATA_FORM_PROVIDERS = {
    name: false,
    last_name: false,
    phone: false,
    email: false,
    company: false,
    rfc: false,
    id_asiggned_me: false,
}

export const DATA_FORM_EMPLOYEES = {

}

export const DATA_FORM_PRODUCTS = {
    code: false,
    description: false,
    price_cost: false,
    price_sale: false,
}

export const skipHandleKeyDown = (event, allowedKeys = [], ctrlKeys = []) => {
    const tag = event?.target?.tagName?.toLowerCase?.() || '';
    const key = event?.key?.toLowerCase?.() || '';
    const isCtrl = event?.ctrlKey;
    const isInput = ['input', 'textarea', 'select'].includes(tag);
    return isInput && !allowedKeys.includes(key) && !(isCtrl && ctrlKeys.includes(key));
};

export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const optionsDate = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
};

export const typeMovementsLabel = {
    1: 'Entrada',
    2: 'Salida',
    3: 'Ajuste',
    4: 'Devolución',
    5: 'Transferencia',
    6: 'Inventario',
}
export const typeMovementsColor = {
    1: 'green',
    2: 'red',
    3: 'blue',
    4: 'orange',
    5: 'purple',
    6: 'yellow',
}