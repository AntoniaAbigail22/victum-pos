import Fetcher from '../../libs/Fetcher';

export const indexProviders = async ({
    page,
    search
}) => {
    let response = { status: false }
    let params = { page }
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

export const deleteProvider = async ({ id }) => {
    let response = { status: false }
    try {
        let fetch = await Fetcher({
            method: 'DELETE',
            url: `/provider/${id}`
        });


        console.log("🚀 ~ deleteProvider ~ fetch:", fetch)

        /*if (fetch.status == 200) {
            response = { status: true, data: fetch?.data };
        }*/
    } catch (error) {
        console.log("🚀 ~ error:", error)
    } finally {
        return response
    }
}

