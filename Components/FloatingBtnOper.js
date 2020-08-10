import React from 'react';
import{
    View,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';

import EventEmitter from 'react-native-eventemitter';



const FloatingBtnOper = () => {
    return(
        <View
         style = {styles.container}
        >
            <TouchableOpacity
             style = {styles.btnAspect}
             onPress = {()=>{
                EventEmitter.emit('onOpenHistory',true)
             }}
            >
                <Image
                 source = {require('../Images/arrowBtn.png')}
                 style = {{width:25,height:25}}
                />
                
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        bottom:10,
        right:10
    },
    btnAspect:{
        width:60,
        height:60,
        borderRadius:60/2,
        backgroundColor:'#0564B3',
        alignItems:'center',
        justifyContent:'center'
    }
})

export default FloatingBtnOper;