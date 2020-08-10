import React,{useEffect,useState} from 'react';
import{
    View,
    ScrollView,
    TouchableOpacity,
    Animated,
    Image,
    StyleSheet,
    Text,
    AsyncStorage
} from 'react-native'

import FloatingButtons from '../Components/FloatingButtons';
import CreateOrder from '../Components/CreateOrder';
import EditOrder from '../Components/EditOrder';
import CardTask from '../Components/CardTask';
import Header from './Header';
import Menu from './Menu';
import BtnCloseOptions from '../Components/BtnCloseOptions';
import History from './History';
import FloatingBtnOper from '../Components/FloatingBtnOper';

import EventEmmiter from 'react-native-eventemitter';
import APIdata from '../Src/APIdata';
import Socket from '../Src/SocketListener';
import {Notifications} from 'react-native-notifications';

var idReadParse


Notifications.registerRemoteNotifications();

Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
        // TODO: Send the token to my server so it could send back push notifications...
        console.log("Device Token Received", event.deviceToken);
});
Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
        console.error(event);
});

Notifications.events().registerNotificationReceivedBackground((notification: Notification, completion: (response: NotificationCompletion) => void) => {
        console.log("Notification Received - Background", notification.payload);
    
        // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
        completion({alert: true, sound: true, badge: false});
});

const NotificationLocal = (title,body)=>{
    Notifications.postLocalNotification({
      title:title,
      body:body          
    })
}

const abortController = new AbortController()

const TaskService = () => {
    let [createOrderView, setCreateOderView] = useState()
    let [menuView, setMenuView] = useState()
    let [userCredentials,setUserCredentials] = useState({})
    let [actuallyTasks, setActuallyTasks] = useState([])
    let [viewFloatingButton, setViewFloatingButton] = useState()
    let [btnCloseEdit, setBtnCloseEdit] = useState()
    let [historyView,setHistoryView] = useState()
    useEffect(()=>{

        abortController.abort()
        const readAPITask = ()=>{
            fetch(APIdata.URI+'/readTasks',{
                method:'PUT',
                body: JSON.stringify({status:'actually'}),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
              .then(res => {
                  setActuallyTasks(res)
              })
              .catch(e=>console.log(e))
        }
        
        readAPITask()
        const readAsync = async()=>{
            const idRead = await AsyncStorage.getItem('credentialsAPPfront')
            idReadParse = JSON.parse(idRead)
            setUserCredentials(idReadParse)
            if(idReadParse.roll === '1'){
                setViewFloatingButton(<FloatingButtons/>)
            }else if (idReadParse.roll === '3'){
                setViewFloatingButton(<FloatingButtons/>)
            }else if (idReadParse.roll === '2'){
                setViewFloatingButton(<FloatingBtnOper/>)
            }
        }

        readAsync()

        Socket.on('onDatesNewOrder',(data)=>{
            console.log(data)
            //generate Notification
            NotificationLocal('Se ha creado una Orden','La orden '+data.numOrder+' ha sido creada')
            readAPITask()
        })

        Socket.on('onDatesDeleteOrder',(data)=>{
            console.log(data)
            //generate Notification
            NotificationLocal('Se ha eliminado una orden','La orden '+data.numOrder+' ha sido eliminada')
            readAPITask()
        })

        Socket.on('onDatesEditOrder',(data)=>{
            console.log(data)
            //generate Notification
            NotificationLocal('Se ha modificado una Orden','La orden '+data.numOrder+' ha sido modificada')
            readAPITask()
        })

        Socket.on('onDatesCompleteOrder',(data)=>{
            console.log(data)
            //generate Notification
            NotificationLocal('Orden completada','La orden '+data.numOrder+' ha sido entregada y finalizada')
            readAPITask()
        })

        EventEmmiter.on('onCloseCreateOrder',()=>{
            setCreateOderView()
        })

        EventEmmiter.on('onOpenCreateOrder',()=>{
            setCreateOderView(<CreateOrder
             userCred = {userCredentials}
            />)
        })

        EventEmmiter.on('onCloseMenu',()=>{
            setTimeout(()=>{
                setMenuView()
            },500)
        })

        EventEmmiter.on('onEnableBtnEdit',()=>{
            setBtnCloseEdit(<BtnCloseOptions/>)
        })
        EventEmmiter.on('onEnableBtnDelete',()=>{
            setBtnCloseEdit(<BtnCloseOptions/>)
        })
        
        EventEmmiter.on('onDisableBtnDelete',()=>{
            setBtnCloseEdit()
        })

        EventEmmiter.on('onOpenEditOrder',(data)=>{
            console.log(data)
            setCreateOderView(<EditOrder
                userCred = {idReadParse}
                orderData = {data}
            />)
        })

        EventEmmiter.on('onCloseHistory',()=>{
            setTimeout(()=>{
                setHistoryView()
            },500)
        })

        EventEmmiter.on('onOpenHistory',()=>{
            setHistoryView(<History/>)
        })
    },[])
       return(
           <View style = {styles.container}>
            <Header
              Title={'FRONT PANEL'}
            />
            <ScrollView style = {{width:'100%'}}>
            <View style = {{width:'100%',height:'100%',alignItems:'center'}}>
            {actuallyTasks.map((data)=>{
                return(
                    <View
                    style = {{width:'100%',alignItems:'center'}}
                    key = {data._id}
                    >
                    <CardTask
                    dataTask = {data}
                    userCred = {userCredentials}
                    />
                    </View>
                )
            })}
            </View>
            </ScrollView>
            {viewFloatingButton}
            
            <TouchableOpacity
             style={styles.btnMenu}
             onPress = {()=>{
                 EventEmmiter.emit('onDisableBtnDelete',true)
                 setMenuView(<Menu
                    userCred = {userCredentials}
                 />)
             }}
            >
                <Image
                 source = {require('../Images/settings.png')}
                 style = {{width:30,height:30}}
                />
            </TouchableOpacity>
            {menuView}
            {historyView}
            {btnCloseEdit}
            {createOrderView}
            
           </View>
       )
}

const styles = StyleSheet.create({
    container:{
      position:'absolute',
      width:'100%',
      height:'100%',
      top:0,
      left:0,
      backgroundColor:'#E3E3E3',
      alignItems:'center'
    },
    btnMenu:{
        width:45,
        height:45,
        borderRadius:45/2,
        backgroundColor:'white',
        position:'absolute',
        alignItems:'center',
        justifyContent:'center',
        left:10,
        top:5
    }
})

export default TaskService;