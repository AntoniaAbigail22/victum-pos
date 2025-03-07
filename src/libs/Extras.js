
const titleError = 'Error'
const messageError = 'Hubo un problema al enviar los datos. Por favor, inténtalo de nuevo.'
const messageWarning = 'Advertencia'
const success = 'Operación éxitosa'

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


export const openNotification = (api, type, description) => {
    api[type]({
        message: messagesNotification[type].message,
        description: description || messagesNotification[type].description,
    });
};
