
const initialState = [];
export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_DOCUMENT':
      return [
          ...state,
          action.document
      ]
    default:
      return state
  };
};