const initState = [];

const reducer = (state = initState, { type, payloads }) => {
  switch (type) {
    case 'ADD_FAVORITE':
      return [...state, payloads.id];
    case 'REMOVE_FAVORITE':
      return state.filter((val) => val !== payloads.id);
    default:
      return state;
  }
};

export default reducer;
