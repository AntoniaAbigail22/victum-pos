const initialState = {
    information_user: {}
}

const reducer = (state = initialState, action) => {

    console.log("🚀 ~ reducer ~ action:", action)
    switch (action.type) {
        case "OPEN_":
            return {
                ...state,
                information_user: action.data.user ? action.data.user : action.data
            };
        default:
            return state;
    }
}

export default reducer;