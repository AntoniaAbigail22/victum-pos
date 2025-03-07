import Fetcher from '../../libs/Fetcher';

export const indexProviders = async ({
    store,
    page,
    search
}) => {
    let response = { status: false }
    let params = { store, page }
    if (search)  params.search = search
    
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
    billing
}) => {
    console.log("🚀 ~ billing:", billing)
    console.log("🚀 ~ provider:", provider)
    let response = { status: false }
    
    try {
        let fetch = await Fetcher({
            method: 'POST',
            url: `/provider`,
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