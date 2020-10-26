import React, {useEffect,useState} from 'react'
import{
    View,
    TextInput,
    Text,
    TouchableOpacity,
    BackHandler,
    StyleSheet,
    Image
} from 'react-native';

import APIdata from '../Src/APIdata';
import * as Progress from 'react-native-progress';
import Header from '../Views/Header';
import EventEmitter from 'react-native-eventemitter';

const RecoveryPassword = (props) =>{
    var [email,setEmail] = useState(props.email)
    var [chargerRound,setChargerRound] = useState()
    const APIRecovery = (email)=>{
        fetch(APIdata.URI+'/sendrecoveryPass',{
            method:'PUT',
            body:JSON.stringify({email}),
            headers:{
                'Content-Type' : 'application/json'
            }
        }).then(res => res.json())
          .then((res)=>{
              if(res.status === 200){
                  setChargerRound()
                  alert('Revisa tu correo para cambiar la contraseña')
                  return true
              }
              setChargerRound()
              alert('Esta cuenta no existe')
          })
          .catch((err)=>{
              setChargerRound()
          })
    }


    useEffect(()=>{
        const backAction = () => {
            EventEmitter.emit('onCloseRecovery',true)
            return true;
        }
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        )

        return () => backHandler.remove();
    },[])
    return(
        <View
         style = {styles.container}
        >
            <Header
              Title = {'Recupera tu contraseña'}
            />
            <View
             style = {styles.containerComponents}
            >
            <Text
             style = {styles.TextTitle}
            >
                Correo Electronico
            </Text>
            <TextInput
             placeholder = {'Ingresa tu correo'}
             style = {styles.TextInput}
             value = {email}
             onChangeText = {(value)=>{
                 setEmail(value)
             }}
            />
            <TouchableOpacity
             style = {styles.ButtonSend}
             onPress = {()=>{
                setChargerRound(<Progress.CircleSnail color={['white']}/>)
                APIRecovery(email)
             }}
            >
                <Text
                 style = {styles.TextBtn}
                >Recuperar mi cuenta</Text>
                {chargerRound}
            </TouchableOpacity>
            </View>
            <TouchableOpacity
             style = {styles.btnBack}
             onPress = {()=>{
                 
                 EventEmitter.emit('onCloseRecovery',true)
                 
             }}
            >
                <Image
                 source = {require('../Images/arrowleft.png')}
                 style={{width:25,height:25}}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        top:0,
        left:0,
        backgroundColor:'white',
        height:'100%',
        width:'100%'
    },
    containerComponents:{
        alignItems:'center',
        justifyContent:"center",
        width:'100%',
        height:'100%'
    },
    TextInput:{
        width:'85%',
        height:50,
        borderWidth:1,
        marginVertical:20,
        borderRadius:15,
        borderColor: '#0564B3'
    },
    ButtonSend:{
        width:'80%',
        borderRadius:15,
        height:50,
        backgroundColor:'#0564B3',
        alignItems:'center',
        justifyContent:'center',
        marginVertical:20,
        flexDirection:'row'
        
    },
    TextBtn:{
        color:'white',
        fontWeight:'bold'
    },
    TextTitle:{
        fontSize:17,
        fontWeight:'bold'
    },
    btnBack:{
        position:'absolute',
        left:10,
        top:15,
        width:30,
        height:30
    },
})

export default RecoveryPassword;