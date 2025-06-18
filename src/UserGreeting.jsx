function UserGreeting(props){

    // if(props.isLoggedin){
    //     return(
    //         <h2>Welcome {props.username}</h2>
    //     );
        
    // }
    // else{
    //     return(
    //     <h2>Please log in to continue</h2>
    //     );
    // }

    return(props.isLoggedin ? 
            <h2 className="welcome-message">Welcom {props.username}</h2>: 
            <h2 className="login-prompt">Please log in to continue</h2>)
    
}
export default UserGreeting