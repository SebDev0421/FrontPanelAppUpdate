import React, {useState,useEffect} from 'react';
import{
    SafeAreaView,
    StyleSheet,
    Image,
    View,
    Text,
    TouchableOpacity,
    TouchableNativeFeedback
}from 'react-native';

import EventEmitter from 'react-native-eventemitter';

const Entry = ()=>{
    return(
        <View style={styles.container}>
            <Image source={require('../Images/towersWall.jpg')} style={{width:'100%',height:'100%',position:'absolute'}}/>
            <Image source={require('../Images/frontPanel.png')} style={{width:200,height:100,marginVertical:50}}/>
            <View style = {styles.Buttons}>
            <TouchableOpacity 
            onPress = {()=>{
                EventEmitter.emit('onCloseRegister',true)
            }}
            style = {[styles.BtnLogin,{backgroundColor:'#0564B3'}]}>
                <Text
                 style={{color:'white',fontWeight:'bold'}}
                >Ingresa</Text>
            </TouchableOpacity>
            <TouchableOpacity
             onPress={()=>{
                EventEmitter.emit('onOpenRegister',true)
             }}
             style = {[styles.BtnLogin,{backgroundColor:'white'}]}
            >
                <Text>Registrate</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        position:'absolute',
        top:0,
        left:0,
        alignItems:'center',
        justifyContent:'center'
    },
    Buttons:{
        position:'absolute',
        bottom:20,
        width:'100%',
        alignItems:'center'
    },
    BtnLogin:{
        height:45,
        alignItems:'center',
        justifyContent:'center',
        marginVertical:15,
        borderRadius:25,
        width:'80%'
    }
})

export default Entry;