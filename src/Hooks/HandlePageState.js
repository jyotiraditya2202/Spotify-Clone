import { create } from 'zustand';

const HandlePageState = create((set) => ({
    CurrentPage: 0,
    SetPage: (No) => set((state) => ({Current_Page: No}))
})
) 

export default HandlePageState;