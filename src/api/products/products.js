import Fetcher from '../../libs/Fetcher';

export const indexWarehouses = async ({ store }) => {
    let response = { status: false };
    let params = { store_id: store };
    
    try {
        let fetch = await Fetcher({
            method: 'GET',
            url: '/inventory',
            params
        });

        if (fetch.status == 200) {
            response = { status: true, data: fetch.data };
        }
    } catch (error) {
        console.error("Error al obtener almacenes:", error);
    } finally {
        return response;
    }
};

export const indexProducts = async ({ store, page = 1, search = '', archive = false }) => {
    let response = { status: false };
    let params = { store, page };
    
    if (search) params.search = search;
    if (archive) params.archive = archive;
    
    try {
        let fetch = await Fetcher({
            method: 'GET',
            url: '/products',
            params
        });

        if (fetch.status == 200) {
            response = { status: true, data: fetch.data };
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
    } finally {
        return response;
    }
};

export const createProduct = async ({ product, variants, store_id, id }) => {
    let response = { status: false };
    
    try {
        let fetch = await Fetcher({
            method: 'POST',
            url: `/products`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                product,
                variants, 
                store_id,
                id
            })
        });

        if (fetch.status == 201) {
            response = { status: true, data: fetch.data };
        }
    } catch (error) {
        console.error("Error al crear producto:", error);
    } finally {
        return response;
    }
};

export const updateProduct = async ({ id, product, store_id }) => {
    let response = { status: false };
    
    try {
        let fetch = await Fetcher({
            method: 'PATCH',
            url: `/products/${id}?store_id=${store_id}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(product)
        });

        if (fetch.status == 200) {
            response = { status: true, data: fetch.data };
        }
    } catch (error) {
        console.error("Error al actualizar producto:", error);
    } finally {
        return response;
    }
};

export const deleteProduct = async ({ id }) => {
    let response = { status: false };
    
    try {
        let fetch = await Fetcher({
            method: 'DELETE',
            url: `/products/${id}`
        });

        if (fetch.status == 200) {
            response = { status: true };
        }
    } catch (error) {
        console.error("Error al eliminar producto:", error);
    } finally {
        return response;
    }
};

export const setArchiveProduct = async ({ id, archive }) => {
    let response = { status: false };
    
    try {
        let fetch = await Fetcher({
            method: 'PATCH',
            url: `/products/${id}/archive`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ archive })
        });

        if (fetch.status == 200) {
            response = { status: true };
        }
    } catch (error) {
        console.error("Error al archivar producto:", error);
    } finally {
        return response;
    }
};

export const getProductDetails = async ({ id }) => {
    let response = { status: false };
    
    try {
        let fetch = await Fetcher({
            method: 'GET',
            url: `/products/${id}`
        });

        if (fetch.status == 200) {
            response = { status: true, data: fetch.data };
        }
    } catch (error) {
        console.error("Error al obtener detalles del producto:", error);
    } finally {
        return response;
    }
};