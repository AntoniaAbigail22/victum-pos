import { data } from 'autoprefixer';
import Fetcher from '../../libs/Fetcher';

export const indexProviders = async ({
    store,
    page,
    search,
    isChecked
}) => {
    let response = { status: false }
    let archive = isChecked == 'true' ? true : false;
    let params = { store, page, isChecked: archive }
    if (search) params.search = search
    
    try {
        let fetch = await Fetcher({
            method: 'GET',
            url: `/provider`,
            params
        });

        if (fetch.status == 200) {
            response = { status: true, data: fetch?.data };
        }
    } catch (error) {
        console.log("🚀 ~ error:", error)
    } finally {
        return response
    }
}

export const getBillingByProvider = async ({
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
        console.log("🚀 ~ error:", error)
    } finally {
        return response
    }
}

export const deleteProvider = async ({ id }) => {
    let response = { status: false }
    try {
        let fetch = await Fetcher({
            method: 'DELETE',
            url: `/provider/${id}`
        });

        console.log("🚀 ~ deleteProvider ~ fetch:", fetch)
        response = { status: true };
        /*if (fetch.status == 200) {
            response = { status: true, data: fetch?.data };
        }*/
    } catch (error) {
        console.log("🚀 ~ error:", error)
    } finally {
        return response
    }
}

export const createProvider = async ({
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
        console.log("🚀 ~ error:", error)
    } finally {
        return response
    }
}

export const setArchiveProvider = async ({ id, archive }) => {
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

        console.log("🚀 ~ deleteProvider ~ fetch:", fetch)
        //response = { status: true };
        if (fetch.status == 201) {
            response = { status: true};
        }
    } catch (error) {
        console.log("🚀 ~ error:", error)
    } finally {
        return response
    }
}

export const upProvider = async ({
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
        console.log("🚀 ~ error:", error)
    } finally {
        return response
    }
}