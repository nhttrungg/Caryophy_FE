// Định nghĩa initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  authenticate: null,
  role: null,
  id: null,
  selectedCategory: null
};

// Định nghĩa action types
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';
const ADDRESS = 'ADDRESS';
const CATEGORY= 'CATEGORY'

// Reducer
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...initialState
      };
    case ADDRESS:
      return {
          ...state,
          user: {...state.user, addresses: [...action.payload] },
      }
      case 'SET_AUTHENTICATE':
        return {
          ...state ,
          authenticate : action.payload.token,
          role: action.payload.role,
          id: action.payload.id,
        }
    case CATEGORY: return {
      ...state,
      selectedCategory: action.payload,
    }
    default:
      return state;
  }
};

export default userReducer;

export const loginRequest = () => ({
  type: LOGIN_REQUEST
});

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error
});

export const logout = () => ({
  type: LOGOUT
});
export const setAuthenticate = (token, role,id) => ({
  type: 'SET_AUTHENTICATE',
  payload: { token, role , id}
});

export const setAddressUser = (address) => ({
  type: ADDRESS,
  payload: address
});

export const setSelectedCategory = (category) => ({
  type: CATEGORY,
  payload: category
});