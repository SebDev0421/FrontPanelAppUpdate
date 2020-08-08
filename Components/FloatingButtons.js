import React, { useState } from 'react';

import{
    View,
    ScrollView,
    TouchableOpacity,
    Animated,
    Image,
    StyleSheet,
    Text
} from 'react-native'

import Socket from '../Src/SocketListener';
import EventEmmiter from 'react-native-eventemitter';

let animation = new Animated.Value(0);
let toValue = 0
const toggleMenu = (valueAnimated) =>{
   toValue = valueAnimated
   Animated.spring(animation,{
       toValue,
       friction:5,
       useNativeDriver:false
   }).start()
}

const rotation ={
    transform:[
        {
            rotate:animation.interpolate({
                inputRange:[0,1],
                outputRange:["0deg","45deg"]
            })
        }
    ]
}

const pinStyle = {
    transform:[
        {scale:animation},
        {
            translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0,-10]
            })
        }
    ]
}
const AddStyle = {
    transform:[
        {scale:animation},
        {
            translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0,-10]
            })
        }
    ]
}

const HistoryStyle = {
    transform:[
        {scale:animation},
        {
            translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0,-10]
            })
        }
    ]
}

const BtnsSecondary = ()=>{
    return(
        <View>
            <Animated.View
             style = {[{flexDirection:'row',alignItems:'center'},HistoryStyle]}
            >
            <View style={styles.boxTextFloating}>
                <Text style = {styles.TextFloating}>Editar orden</Text>
            </View>
            <View
             style = {styles.floatingBtnSecondary}
            >
            <TouchableOpacity
             onPress={()=>{
                EventEmmiter.emit('onEnableBtnEdit',true)
             }}
            >
                <Image source = {require('../Images/editBlue.png')} style = {{width:25,height:25}}/>  
            </TouchableOpacity>
            </View>
            </Animated.View>

            <Animated.View
             style = {[{flexDirection:'row',alignItems:'center'},HistoryStyle]}
            >
            <View style={styles.boxTextFloating}>
                <Text style = {styles.TextFloating}>Eliminar orden</Text>
            </View>
            <View
             style = {styles.floatingBtnSecondary}
            >
            <TouchableOpacity
             onPress={()=>{
                 EventEmmiter.emit('onEnableBtnDelete',true)
                 
             }}
            >
                <Image source = {require('../Images/eliminarBlue.png')} style = {{width:25,height:25}}/>  
            </TouchableOpacity>
            </View>
            </Animated.View>
            <Animated.View
             style = {[{flexDirection:'row',alignItems:'center'},HistoryStyle]}
            >
            <View style={styles.boxTextFloating}>
                <Text style = {styles.TextFloating}>Historial</Text>
            </View>
            <View
             style = {styles.floatingBtnSecondary}
            >
            <TouchableOpacity
             onPress={()=>{
                 Socket.emit('onNewOrder','hola')
                 console.log('press floating')
             }}
            >
                <Image source = {require('../Images/historia.png')} style = {{width:25,height:25}}/>  
            </TouchableOpacity>
            </View>
            </Animated.View>
            
            <Animated.View
             style = {[{flexDirection:'row',alignItems:'center'},AddStyle]}
            >
            <View style={styles.boxTextFloating}>
                <Text style = {styles.TextFloating}>Crear una orden</Text>
            </View>
            <View
             style = {styles.floatingBtnSecondary}
            >
            <TouchableOpacity
             onPress={()=>{
                 EventEmmiter.emit('onOpenCreateOrder',true)
             }}
            >
                <Image source = {require('../Images/anadir.png')} style = {{width:25,height:25}}/>  
            </TouchableOpacity>
            </View>
            </Animated.View>
            <Animated.View
             style = {[{flexDirection:'row',alignItems:'center'},pinStyle]}
            >
            <View style={styles.boxTextFloating}>
                <Text style = {styles.TextFloating}>Notificaciones</Text>
            </View>
            <View
             style = {styles.floatingBtnSecondary}
            >
            <TouchableOpacity
             onPress={()=>{
                 console.log('press floating')
             }}
            >
                <Image source = {require('../Images/notificacion.png')} style = {{width:25,height:25}}/>  
            </TouchableOpacity>
            </View>
            </Animated.View>
        </View>
    )
}

const FloatingButtons = () =>{
    let [viewBtnsSecondary,setViewBtnsSecondary] = useState()
    let [controlView, setControlView] = useState(false)
    return(
        <View
             style = {styles.ButtonsPositions}
            >

            {viewBtnsSecondary}
            
            <View
             style={{width:'100%',alignItems:'flex-end'}}
            >
            <TouchableOpacity
             onPress={()=>{
                 if(controlView){
                    setViewBtnsSecondary()
                    setControlView(false)
                    toggleMenu(0)
                 }else{
                    setViewBtnsSecondary(<BtnsSecondary/>)
                    toggleMenu(1)
                     setControlView(true)
                 }
                 
             }}
            >
            <Animated.View
            style = {[styles.floatingBtn,rotation]}
            >
                <Image source = {require('../Images/mas.png')} style = {{width:25,height:25}}/>  
            </Animated.View>
            </TouchableOpacity>
            </View>
            </View>
    )
}

const styles = StyleSheet.create({
    floatingBtn:{
        width:60,
        height:60,
        borderRadius:60/2,
        backgroundColor:'#065FA9',
        alignItems:'center',
        justifyContent:'center'
    },
    floatingBtnSecondary:{
        width:45,
        height:45,
        borderRadius:45/2,
        backgroundColor:'white',
        borderWidth:1,
        borderColor:'#065FA9',
        alignItems:'center',
        justifyContent:'center',
        marginVertical:5 
    },
    ButtonsPositions:{
        position:'absolute',
        bottom:15,
        right:15,
        alignItems:'center',
        justifyContent:'center'
        
    },
    TextFloating:{
        color:'white',
        marginHorizontal:8
    },
    boxTextFloating:{
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#065FA9',
        marginRight:10,
        borderTopEndRadius:10,
        borderBottomStartRadius:10
    }
})

export default FloatingButtons;