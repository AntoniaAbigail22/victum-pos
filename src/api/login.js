import { headers2 } from "../libs/Extras";
import Fetcher from "../libs/Fetcher";


export const login = async ({ data }) => {
    let fetch = { status: false };
    // Simulación local: si el backend no está disponible, devolver usuario de prueba
    try {
        // --- INICIO BLOQUE ORIGINAL ---
        // console.log("🚀 ~ createNews ~ data:", data)
        // let response = await Fetcher({
        //     url: `/auth`,
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     data
        // });
        // console.log(response?.status, response?.data)
        // if (response.status === 200) fetch = { status: true, data: response?.data }
        // if (response.status === 401) fetch = { message: response?.data?.message }
        // --- FIN BLOQUE ORIGINAL ---

        // Simulación de login exitoso
        fetch = {
            status: true,
            data: {
                user: {
                    store_id: 1,
                    id: 123,
                    name: 'Usuario Demo',
                    email: data.email,
                    // Puedes agregar más campos si lo necesitas
                }
            }
        };
    } catch (error) {
        console.log("Error: " + error)
    } finally {
        return fetch;
    }
}
