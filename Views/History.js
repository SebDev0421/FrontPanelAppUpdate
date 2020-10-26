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
import * as Progress from 'react-native-progress';

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


const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize})=>{
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
}


var sizeLen = 10;

const History = (props) =>{
    let [dataHistory,setDataHistory] = useState([]);
    let [roll, setRoll] = useState('');
    let [chargerRound , setChargerRound] = useState()
    let [enableReloadAPI, setEnableReloadAPI ] = useState(false)
    const ReadAPIHistory = (size)=>{
        fetch(APIdata.URI+'/getHistory',{
            method:'PUT',
            body:JSON.stringify({lenght:size}),
            headers:{
                'Content-Type' : 'application/json'
            }
        }).then(res => res.json())
          .then((res) => {
              setDataHistory(res.status)
              const len = Object.keys(res.status).length;
              if(len < size){
                  setChargerRound()
                  setEnableReloadAPI(false)
              }else if(len == size && size < parseInt(res.len)){
                setChargerRound(<Progress.CircleSnail
                    color={['blue']}/>)
              }
              sizeLen  = sizeLen + 10;
              setEnableReloadAPI(true)
          })
          .catch(e => console.log(e))
    }

    useEffect(()=>{
       sizeLen = 10;
       move = 0
       swipeEffect()
       const readUserdata = async()=>{
        const data = await AsyncStorage.getItem('credentialsAPPfront')
        const userCred = JSON.parse(data)
        setRoll(userCred.roll)
        console.log(userCred.roll)
    }
    readUserdata()
       
       

       ReadAPIHistory(sizeLen);
       
       EventEmitter.on('onDeleteHistoryOrder',(data)=>{
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
             onScroll = {({nativeEvent})=>{
                 if(isCloseToBottom(nativeEvent)){
                     if(enableReloadAPI){
                         ReadAPIHistory(sizeLen)
                     }
                 }
             }}
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
                  {chargerRound}
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


