// Định nghĩa initial state
const initialState = {
    orderPage: null
};

const SET_ORDER_PAGE = 'SET_ORDER_PAGE';

// Action creator
export const setOrderPage = (orderPage) => ({
    type: SET_ORDER_PAGE,
    payload: orderPage
});

// Reducer
const commonReducer = (state = initialState, action) => {
    switch (action.type) {
          case SET_ORDER_PAGE:
              return {
                 ...state,
                  orderPage: action.payload
              };
          default:
              return state;
    }
};

export default commonReducer;