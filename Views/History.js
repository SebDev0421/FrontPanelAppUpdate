import React, {useEffect,useState} from 'react';
import{
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Image,
    ScrollView,
    AsyncStorage
} from 'react-native';

import EventEmitter from 'react-native-eventemitter';
import CardHistory from '../Components/CardHistory';
import APIdata from '../Src/APIdata';

import {Notifications} from 'react-native-notifications';

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


const History = (props) =>{
    let [dataHistory,setDataHistory] = useState([]);
    let [roll, setRoll] = useState('')
    useEffect(()=>{
       move = 0
       swipeEffect()
       const readUserdata = async()=>{
        const data = await AsyncStorage.getItem('credentialsAPPfront')
        const userCred = JSON.parse(data)
        setRoll(userCred.roll)
        console.log(userCred.roll)
    }
    readUserdata()
       
       const ReadAPIHistory = ()=>{
           fetch(APIdata.URI+'/getHistory',{
               method:'PUT',
               headers:{
                   'Content-Type' : 'application/json'
               }
           }).then(res => res.json())
             .then(res => {
                 setDataHistory(res)
             })
             .catch(e => console.log(e))
       }

       ReadAPIHistory()
       
       
       EventEmitter.on('onDeleteHistoryOrder',()=>{
           Notifications.postLocalNotification({
               title:'Orden eliminada del historial',
               body:'Has eliminado la orden'
           })

           ReadAPIHistory()
       })
    },[])

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
                  {dataHistory.map((value)=>{
                      return(
                          <View
                           key={value._id}
                           style={{width:'100%',alignItems:'center'}}
                          >
                              <CardHistory
                               dataCard = {value}
                               roll = {roll}
                              />
                          </View>
                      )
                  })}
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


