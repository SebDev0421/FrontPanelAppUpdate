import React, {useEffect,useState} from 'react';
import{
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Image,
    ScrollView
} from 'react-native';

import EventEmitter from 'react-native-eventemitter';
import CardHistory from '../Components/CardHistory';


import Header from './Header';

const animation = new Animated.Value(Dimensions.get('window').width);
let move = 0

const swipeEffect = () => {
    Animated.timing(
        animation,
        {
            toValue:move,
            duration:400,
            useNativeDriver:false
        }
    ).start()
}


const History = ()=>{
    useEffect(()=>{
       move = 0
       swipeEffect()
    })

    return(
        <Animated.View
         style={[styles.container,{left:animation}]}
        >
            <Header
              Title = "Historial"
            />
            <ScrollView
             style = {styles.ScrollCards}
            >
                <View
                 style = {styles.containerCard}
                >
                    <CardHistory/>
                </View>
            </ScrollView>
            <TouchableOpacity
             style = {styles.btnBack}
             onPress = {()=>{
                 move = Dimensions.get('window').width
                 
                 swipeEffect()

                 EventEmitter.emit('onCloseHistory',true)
                 
             }}
            >
                <Image
                 source = {require('../Images/arrowleft.png')}
                 style={{width:25,height:25}}
                />
            </TouchableOpacity>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    container:{
        position:'absolute',
        width:'100%',
        height:'100%',
        top:0,
        backgroundColor:'#E3E3E3'
    },
    btnBack:{
        position:'absolute',
        left:10,
        top:15,
        width:30,
        height:30
    },
    ScrollCards:{
        width:'100%'
    },
    containerCard:{
        width:'100%',
        height:'100%',
        alignItems:'center'
    }
})

export default History;


