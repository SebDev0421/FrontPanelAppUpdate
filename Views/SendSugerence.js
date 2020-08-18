import React,{useState, useEffect} from 'react';
import{
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    BackHandler,
    Text
} from 'react-native'

import EventEmitter from 'react-native-eventemitter'
import APIdata from '../Src/APIdata';

const APISendAdvice = (advice)=>{
    fetch(APIdata.URI+'/adviceSend',{
        method:'PUT',
        body:JSON.stringify({advice:advice}),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(res => res.json())
      .then((res)=>{
          if(res.status === 200){
             alert('Sugerencia enviada')
             EventEmitter.emit('onCloseTextInputSugerence',true)
             return 0
          }
          alert('Ocurrio un error enviando la sugerencia, intentalo de nuevo')
      })
      .catch((e)=>{
          if(e) throw e
      })
}

const SendSugerence = ()=>{
    let [sugerence, setSugerence] = useState('')
    useEffect(()=>{
        const backAction = () => {
            EventEmitter.emit('onCloseTextInputSugerence',true)
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
            <View
             style = {styles.containerPrimary}
            >
                <Text
                 style = {styles.title}
                >Envia tu sugerencia</Text>
                <TextInput
                 multiline
                 placeholder = {'Escribe tu sugerencia'}
                 style={styles.TextInput}
                 onChangeText = {(value)=>{
                     setSugerence(value)
                 }}
                />
                <TouchableOpacity
                 style = {styles.btn}
                 onPress = {()=>{
                     if(sugerence === ''){
                         alert('No has escrito una sugerencia')
                         return 0
                     }

                     APISendAdvice(sugerence)
                 }}
                >
                    <Text
                     style = {{color:'white',fontWeight:'bold'}}
                    >Enviar sugerencia</Text>
                </TouchableOpacity>
                <TouchableOpacity
                 style = {styles.btnClose}
                 onPress = {()=>{
                    EventEmitter.emit('onCloseTextInputSugerence',true)
                 }}
                >
                    <Image
                     source = {require('../Images/cerrar.png')}
                     style = {{width:25,height:25}}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        top:0,
        left:0,
        width:'100%',
        height:'100%',
        backgroundColor:'rgba(0,0,0,0.5)',
        alignItems:'center',
        justifyContent:'center'
    },
    containerPrimary:{
        width:'90%',
        backgroundColor:'white',
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center'
    },
    TextInput:{
        borderWidth:1,
        borderRadius:20,
        height:120,
        width:'90%',
        marginVertical:10
    },
    btn:{
        justifyContent:'center',
        alignItems:'center',
        width:'90%',
        height:50,
        backgroundColor:'#0564B3',
        borderRadius:15,
        marginVertical:10
    },
    title:{
        marginVertical:10,
        fontWeight:'bold'
    },
    btnClose:{
        position:'absolute',
        top:5,
        left:10
    }
})

export default SendSugerence;

