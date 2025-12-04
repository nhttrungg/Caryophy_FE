// Action Types
const SET_CART_ITEMS = 'SET_CART_ITEMS';
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const SET_SELECTED_VARIANTS = 'SET_SELECTED_VARIANTS';
const CLEAR_CART = 'CLEAR_CART';

// Initial State
const initialState = {
    items: [],
    total: 0,
    selectedVariants: [],
};

// Helper function to calculate total
const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// Reducer
const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CART_ITEMS:
            return {
                ...state,
                items: action.payload,
                total: calculateTotal(action.payload),
            };
        case ADD_TO_CART:
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            let updatedItems;
            if (existingItem) {
                updatedItems = state.items.map(item =>
                    item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updatedItems = [...state.items, { ...newItem, quantity: 1 }];
            }
            return {
                ...state,
                items: updatedItems,
                total: calculateTotal(updatedItems),
            };
        case REMOVE_FROM_CART:
            const filteredItems = state.items.filter(item => item.id !== action.payload);
            return {
                ...state,
                items: filteredItems,
                total: calculateTotal(filteredItems),
            };
        case UPDATE_QUANTITY:
            const { id, change } = action.payload;
            const updatedItemsQuantity = state.items.map(item =>
                item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
            );
            return {
                ...state,
                items: updatedItemsQuantity,
                total: calculateTotal(updatedItemsQuantity),
            };
        case SET_SELECTED_VARIANTS:
            return {
                ...state,
                selectedVariants: action.payload,
            };
        case CLEAR_CART:
            return initialState;
        default:
            return state;
    }
};

// Action Creators
export const setCartItems = (items) => ({
    type: SET_CART_ITEMS,
    payload: items,
});

export const addToCart = (item) => ({
    type: ADD_TO_CART,
    payload: item,
});

export const removeFromCart = (id) => ({
    type: REMOVE_FROM_CART,
    payload: id,
});

export const updateQuantity = (id, change) => ({
    type: UPDATE_QUANTITY,
    payload: { id, change },
});

export const setSelectedVariants = (variants) => ({
    type: SET_SELECTED_VARIANTS,
    payload: variants,
});

export const clearCart = () => ({
    type: CLEAR_CART,
});

export default cartReducer;