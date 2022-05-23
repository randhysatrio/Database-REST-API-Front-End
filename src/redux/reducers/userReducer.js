const init_state = {
  idusers: 0,
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  token: '',
  role: '',
};

const userReducer = (state = init_state, { type, payload }) => {
  switch (type) {
    case 'USER_REGISTER':
      return { ...state, ...payload };
    case 'USER_LOGOUT':
      return init_state;
    default:
      return state;
  }
};

export default userReducer;
