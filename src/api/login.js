import { headers2 } from "../libs/Extras";
import Fetcher from "../libs/Fetcher";


export const login = async ({ data }) => {
    let fetch = { status: false };
    try {
        console.log("🚀 ~ createNews ~ data:", data)
        let response = await Fetcher({
            url: `/auth`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data
        });

        console.log(response?.status, response?.data)

        if (response.status === 200) fetch = { status: true, data: response?.data }
        if (response.status === 401) fetch = { message: response?.data?.message }
    } catch (error) {
        console.log("Error: " + error)
    } finally {
        return fetch;
    }
}
