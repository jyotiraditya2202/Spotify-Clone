    import { FaFlask } from 'react-icons/fa';
    import { create } from 'zustand';

    const HandleLoginHook = create((set) => ({
        IsLogin: false,
        CurrentUser: null,
        Login: (User) => set((state) => ({IsLogin:true,CurrentUser:User})),
        Logout: () => set((state) => ({IsLogin:false,CurrentUser:null})),
    })
    ) 

    export default HandleLoginHook;