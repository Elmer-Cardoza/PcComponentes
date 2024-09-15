import React, {useReducer, createContext, useEffect} from "react";
import {signOut} from "firebase/auth";
import {auth, db} from "../db/firebase"
import {onSnapshot, doc} from "firebase/firestore";

 const estadoinicial = {
    usuario: {},
 };

 if (localStorage.getItem("IdToken")){
    const usuarioData={
        Metodo: localStorage.getItem("Metodo"),
        IdCliente: localStorage.getItem("IdCliente"),
        IdToken: localStorage.getItem("IdToken"),
        Correo: localStorage.getItem("Correo"),
        Nombres: localStorage.getItem("Nombres"),
        Apellidos: localStorage.getItem("Apellidos"),
        Genero: localStorage.getItem("Genero"),
        FechaNacimiento: localStorage.getItem("FechaNacimiento"),
        Celular: localStorage.getItem("Celular"),
        FotoURL: localStorage.getItem("FotoURL"),
        Rol: localStorage.getItem("Rol"),
};
    estadoinicial.usuario=usuarioData;
}    else{
        estadoinicial.usuario= {};
}

const EstadoContexto = createContext({
    usuario: {},
    cerrarSesion:() => {},
    iniciarSesion: (usuarioData)=> {},
})

function estadoReductor(state, action){
switch (action.type){
    case "NUEVA_SESION":
    return{
        ...state,
        usuario: Object.assign(state.usuario, action.payload),
    };
    case "CERRAR_SESION":
        return {...state, usuario:{}};
        default:
            return state;
    }
}

function EstadoProveedor(props){
    const [state, dispatch]= useReducer (estadoReductor, estadoinicial);

    useEffect(()=> {
        if (localStorage.getItem("IdToken")){
            const rolUsuario= localStorage.getItem("Rol");
            const clienteRef=doc(
                db,
                `${rolUsuario=== "administrador"?"Personales":"Clientes"}`,
                localStorage.getItem("idCliente")
            );
            onSnapshot(clienteRef,(doc)=>{
                if(localStorage.getItem("IdToken")==doc.data().IdToken){
                    const userData={
                        Nombres: doc.data().Nombres,
                        Apellidos: doc.data().Apellidos,
                        Genero: doc.data().Genero,
                        FechaNacimiento: doc.data().FechaNacimiento,
                        Celular: doc.data().Celular,
                        FotoURL: doc.data().FotoURL,
                    };
                    dispatch({
                        type:"NUEVA_SESION",
                        payload: userData,
                    });
                    localStorage.setItem("Nombres", doc.data().Nombres);
                    localStorage.setItem("Apellidos", doc.data().Apellidos);
                    localStorage.setItem("Genero", doc.data().Genero);
                    localStorage.setItem("FechaNacimiento", doc.data().FechaNacimiento);
                    localStorage.setItem("Celular", doc.data().Celular);
                    localStorage.setItem("FotoUrl",doc.data().FotoURL);
                } else {
                    console.log("No hay usuario");
                    cerrarSesion();
                }
            });
        }
    }, [state.user]);
    
    function iniciarSesion(usuarioData){
        localStorage.setItem("Metodo",usuarioData.Metodo);
        localStorage.setItem("IdCliente",usuarioData.IdCliente);
        localStorage.setItem("IdToken",usuarioData.IdToken);
        localStorage.setItem("Correo",usuarioData.Correo);
        localStorage.setItem("Nombres",usuarioData.Nombres);
        localStorage.setItem("Apellidos",usuarioData.Apellidos);
        localStorage.setItem("Genero", doc.data().Genero);
        localStorage.setItem("FechaNacimiento", doc.data().FechaNacimiento);
        localStorage.setItem("Celular", doc.data().Celular);
        localStorage.setItem("FotoUrl",doc.data().FotoURL);
        localStorage.setItem("Rol",doc.data().Rol);
        
        dispatch({
            type:"NUEVA_SESION",
            payload:usuarioData,
        });
    }    
function cerrarSesion(){
    localStorage.removeItem("Metodo");
    localStorage.removeItem("IdCliente");
    localStorage.removeItem("IdToken");
    localStorage.removeItem("Correo");
    localStorage.removeItem("Nombres");
    localStorage.removeItem("Apellidos");
    localStorage.removeItem("FechaNacimiento");
    localStorage.removeItem("Celular");
    localStorage.removeItem("FotoUrl");
    localStorage.removeItem("Rol");
    signOut(auth)
    .then(()=>{
        dispatch({
            type: "CERRAR_SESION",
            user: {},
        });
    })
        .catch((error)=>{
            console.log("Error al cerrar sesion: ",error);
    });
}

return(
    <EstadoContexto.Provider
    value={{
        usuario:state.usuario,
        cerrarSesion,
        iniciarSesion,
    }}
    {...props}
    />
    );
}
export { EstadoContexto, EstadoProveedor};