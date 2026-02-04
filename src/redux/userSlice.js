import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null, // Basic Auth Data (uid, email)
  userData: null,    // Firestore Profile Data (image, name, phone)
  role: 'buyer',     // 'admin' or 'buyer'
  loading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload.currentUser;
      state.userData = action.payload.userData;
      state.role = action.payload.role; // Store the calculated role
      state.loading = false;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.userData = null;
      state.role = 'buyer';
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setUser, logoutUser, setLoading } = userSlice.actions;
export default userSlice.reducer;