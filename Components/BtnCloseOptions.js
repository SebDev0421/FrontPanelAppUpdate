import React from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import EventEmitter from 'react-native-eventemitter';

const BtnCloseOptions = ()=>{
    return(
        <View
         style={styles.containerBtn}
        >
            <TouchableOpacity
             onPress={()=>{
                 EventEmitter.emit('onDisableBtnDelete',true)
             }}
            >
                <Image 
                source={require('../Images/cerrarWhite.png')}
                style = {{width:25,height:25}}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    containerBtn:{
        position:'absolute',
        top:15,
        right:20
    }
})

export default BtnCloseOptions