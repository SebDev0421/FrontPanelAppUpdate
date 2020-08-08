import React, {useState,useEffect} from 'react';
import{
    SafeAreaView,
    StyleSheet,
    Image,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableNativeFeedback,
    AsyncStorage,
    Alert
}from 'react-native';


import APIdata from '../Src/APIdata'
import EventEmitter from 'react-native-eventemitter';

const APILogin = (email,password)=>{
    fetch(APIdata.URI+'/login',{
        method:'PUT',
        body:JSON.stringify({email:email,password:password}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(function(res){return res.json()})
      .then(async(res) => {
          if(res.status === 302){
              alert('Algo salio mal revisa de nuevo')
              return 0
          }
          if(res.status.password === password && res.status.auth === '1'){
            try{
                await AsyncStorage.setItem('credentialsAPPfront',JSON.stringify(res.status))
                EventEmitter.emit('openService',true)
                return 0
            }catch(e){
                console.log(e)
            }
          }
          alert('Su cuenta no a sido autorizada o la contraseña es incorrecta')
      })
      .catch(err => {

        alert('Hubo un error tratando de conectar a los servidores')
      })
}

const Login = ()=>{
    let [visibility,setVisiblity] = useState(true)
    let [email,setEmail] = useState('')
    let [password, setPassword] = useState('')
    return(
        <View style={styles.container}>
            <Image source={require('../Images/frontPanel.png')} style={{width:200,height:100,marginVertical:50}}/>
            <View style={{width:'80%'}}>
            <View style={{marginVertical:20}}>
            <Text>Correo</Text>
            <View style={styles.TextInput}>
            <TextInput
             placeholder = "Ingresa correo"
             keyboardType='email-address'
             onChangeText = {(value)=>{
                setEmail(value)
             }
             }
            />
            </View>
            </View>
            <View style={{marginVertical:20}}>
            <Text>Contraseña</Text>
            <View style={[{flexDirection:'row',alignItems:'center'},styles.TextInput]}>
            <TextInput
             placeholder = "Ingresa contraseña"
             keyboardType = 'default'
             secureTextEntry = {visibility}
             style={{width:'90%'}}
             onChangeText = {(value)=>{
                setPassword(value)
             }
             }
            />
            <TouchableOpacity
             onPress={()=>{
                 setVisiblity(!visibility)
             }}
            >
                <Image source = {require('../Images/ojo.png')} style={{width:20,height:20}}/>
            </TouchableOpacity>
            </View>
            <View style={{marginVertical:7}}>
                <TouchableNativeFeedback>
                    <Text>Olvidaste tu contraseña?</Text>
                </TouchableNativeFeedback>
            </View>
            </View>
            </View>
            <TouchableOpacity
             style={styles.ButtonLogin}
             onPress={()=>{
                 if(email === '' || password === ''){
                    alert('Llena todos los campos')
                    return 0
                 }
                 APILogin(email,password)
                 
            }}
            >
                <Text
                 style={styles.TextBtn}
                >Ingresar</Text>
            </TouchableOpacity>
            <TouchableNativeFeedback
             onPress={()=>{
                 EventEmitter.emit('onOpenRegister',true)
             }}
            >
                <Text>Aun no tienes cuenta?</Text>
            </TouchableNativeFeedback>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center'
    },
    ButtonLogin:{
        backgroundColor:'#0564B3',
        width:'85%',
        height:45,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:30,
        marginVertical:20
    },
    TextBtn:{
        color:'white',
        fontWeight:'bold'
    },
    TextInput:{
        borderBottomWidth:1
    }
})

export default Login