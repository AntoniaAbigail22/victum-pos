import { data } from 'autoprefixer';
import Fetcher from '../../libs/Fetcher';

const url_ = {
    1: 'products',
    2: 'inventory',
    3: 'departments',
    4: 'save_inventory',
    5: 'inventory/save',
}

export const indexProducts = async ({
    store,
    type,
    page,
    search,
    isChecked,
    id
}) => {
    let response = { status: false }
    //let archive = isChecked == 'true' ? true : false;
    let params = { store, type, page }
    if (search) params.search = search
    if (id) params.id = id

    if (type == 1) {
        //products
    }
    if (type == 2) {
        //warehouses
    }
    if (type == 3) {
        //departments
    }
    if (type == 4) {
        //movement-report
    }

    let url = url_[type];

    try {
        let fetch = await Fetcher({
            method: 'GET',
            url,
            params
        });

        console.log("🚀 ~ fetch:", fetch)

        if (fetch.status == 200) {
            response = { status: true, data: fetch?.data };
        }

        console.log("🚀 ~ response:", response)
    } catch (error) {
        console.log("🚀 ~ error indexDirectorys:", error)
    } finally {
        return response
    }
}

export const getBillingByProviders = async ({
    id
}) => {
    let response = { status: false }
    try {
        let fetch = await Fetcher({
            method: 'GET',
            url: `/provider/billing/${id}`
        });

        if (fetch.status == 200) {
            response = { status: true, data: fetch?.data };
        }
    } catch (error) {
        console.log("🚀 ~ error getBillingByProviders:", error)
    } finally {
        return response
    }
}

export const deleteDirectory = async ({ id }) => {
    let response = { status: false }
    try {
        let fetch = await Fetcher({
            method: 'DELETE',
            url: `/provider/${id}`
        });

        console.log("🚀 ~ deleteDirectory ~ fetch:", fetch)
        response = { status: true };
        /*if (fetch.status == 200) {
            response = { status: true, data: fetch?.data };
        }*/
    } catch (error) {
        console.log("🚀 ~ error deleteDirectory:", error)
    } finally {
        return response
    }
}

export const createDirectory = async ({
    provider,
    billing,
    store_id
}) => {
    console.log("🚀 ~ billing:", billing)
    console.log("🚀 ~ provider:", provider)
    let response = { status: false }

    try {
        let fetch = await Fetcher({
            method: 'POST',
            url: `/provider/${store_id}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                provider,
                billing
            })
        });

        console.log("🚀 ~ fetch:", fetch)

        if (fetch.status == 201) {
            response = { status: true, data: fetch?.data };
        }
    } catch (error) {
        console.log("🚀 ~ error createDirectory:", error)
    } finally {
        return response
    }
}

export const setArchiveDirectory = async ({ id, archive }) => {
    let response = { status: false }
    try {
        let fetch = await Fetcher({
            method: 'PATCH',
            url: `/provider/archiver/${id}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                archive
            })
        });

        console.log("🚀 ~ deleteDirectory ~ fetch:", fetch)
        //response = { status: true };
        if (fetch.status == 201) {
            response = { status: true };
        }
    } catch (error) {
        console.log("🚀 ~ error setArchiveDirectory:", error)
    } finally {
        return response
    }
}

export const upDirectory = async ({
    provider,
    billing,
    id,
    store_id
}) => {
    let response = { status: false }

    try {
        let fetch = await Fetcher({
            method: 'PATCH',
            url: `/provider/${id}?store_id=${store_id}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                provider,
                billing
            })
        });

        console.log("🚀 ~ fetch:", fetch)

        if (fetch.status == 201) {
            response = { status: true, data: fetch?.data };
        }
    } catch (error) {
        console.log("🚀 ~ error upDirectory:", error)
    } finally {
        return response
    }
}