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
import ListNotification from '../Components/ListNotification';

import EventEmmiter from 'react-native-eventemitter';
import APIdata from '../Src/APIdata';
import Socket from '../Src/SocketListener';
import {Notifications} from 'react-native-notifications';

var idReadParse


Notifications.registerRemoteNotifications();

/* Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
        // TODO: Send the token to my server so it could send back push notifications...
        console.log("Device Token Received", event.deviceToken);
        Socket.emit('onNewTokenDevice', event.deviceToken)
});
Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
        console.error(event);
});

Notifications.events().registerNotificationReceivedBackground((notification: Notification, completion: (response: NotificationCompletion) => void) => {
        console.log("Notification Received - Background", notification.payload);
    
        // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
        completion({alert: true, sound: true, badge: false});
}); */

const NotificationLocal = (title,body)=>{
    Notifications.postLocalNotification({
      title:title,
      body:body          
    })
}

const abortController = new AbortController()

const IndicatorTask = (props)=>{

    return(
        <View
                 style = {{
                     position:'absolute',
                     width:20,
                     height:20,
                     borderRadius:20/2,
                     backgroundColor: 'red',
                     bottom:-5,
                     right:-5,
                     justifyContent:'center',
                     alignItems:'center'
                 }}
                >
                    <Text
                     style = {{
                         color:'white'
                     }}
                    >{props.numTasks}</Text>
        </View>
    )
}

var vectorRead = []
var numberNotifi = 0

const TaskService = () => {
    let [createOrderView, setCreateOderView] = useState()
    let [menuView, setMenuView] = useState()
    let [userCredentials,setUserCredentials] = useState({})
    let [actuallyTasks, setActuallyTasks] = useState([])
    let [notificationsAPI, setNotificationsAPI] = useState([])
    let [viewFloatingButton, setViewFloatingButton] = useState()
    let [btnCloseEdit, setBtnCloseEdit] = useState()
    let [historyView,setHistoryView] = useState()
    let [sizeTasks, setSizeTasks] = useState()
    let [viewListNotifications, setViewListNotifiactions] = useState()
    let [toogleList, setToogleList] = useState(false)
    let [taskNotifiNum, setTaskNotifiNum] = useState(0)

    const writeNumberNotifications = async(value)=>{
        try{
            await AsyncStorage.setItem('numNotificationsView',value)
        }catch(e){
            console.log(e)
        }
    }

    const readNumbreNotifications = async(value)=> {
        const numNotViews = await AsyncStorage.getItem('numNotificationsView');
        
        if(numNotViews === null){
            numberNotifi = value
        }else{
            numberNotifi = value - parseInt(numNotViews)
            setSizeTasks(<IndicatorTask
                numTasks = {numberNotifi}
            />)
            console.log(numberNotifi)
        }
    }

    const refreshTasks = () =>{
        const readAPITask = async()=>{
            await fetch(APIdata.URI+'/readTasks',{
                method:'PUT',
                body: JSON.stringify({status:'actually'}),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
              .then((res) => {
                  setActuallyTasks(res)
              })
              .catch(e=>console.log(e))       
        }


        const readAPINotifiactionsTask = async()=>{
            await fetch(APIdata.URI+'/NotificationsRead',{
                method:'PUT',
                body: JSON.stringify({status:'actually'}),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
              .then((res) => {
                  setNotificationsAPI(res)
                  vectorRead = res
                  
              })
              .catch(e=>console.log(e))
                readNumbreNotifications(vectorRead.length)
                setTaskNotifiNum(vectorRead.length)
        }

        

        // read API 
        readAPITask()
        readAPINotifiactionsTask()
    }

    useEffect(()=>{

        
        abortController.abort()
        
        const readAPITask = async()=>{
            await fetch(APIdata.URI+'/readTasks',{
                method:'PUT',
                body: JSON.stringify({status:'actually'}),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
              .then((res) => {
                  setActuallyTasks(res)
              })
              .catch(e=>console.log(e))
                
                         
        }


        const readAPINotifiactionsTask = async()=>{
            await fetch(APIdata.URI+'/NotificationsRead',{
                method:'PUT',
                body: JSON.stringify({status:'actually'}),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
              .then((res) => {
                  setNotificationsAPI(res)
                  vectorRead = res
                  
              })
              .catch(e=>console.log(e))
                readNumbreNotifications(vectorRead.length)
                setTaskNotifiNum(vectorRead.length)
        }

        

        // read API 
        readAPITask()
        readAPINotifiactionsTask()


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
            readAPINotifiactionsTask()
            NotificationLocal('Se ha creado una Orden','La orden '+data.numOrder+' ha sido creada')
            readAPITask()
        })

        Socket.on('onDatesDeleteOrder',(data)=>{
            console.log(data)
            //generate Notification
            NotificationLocal('Se ha eliminado una orden','La orden '+data.numOrder+' ha sido eliminada')
            readAPINotifiactionsTask()
            readAPITask()
        })

        Socket.on('onDatesEditOrder',(data)=>{
            console.log(data)
            //generate Notifications
            NotificationLocal('Se ha modificado una Orden','La orden '+data.numOrder+' ha sido modificada')
            readAPINotifiactionsTask()
            readAPITask()
        })

        Socket.on('onDatesCompleteOrder',(data)=>{
            console.log(data)
            //generate Notification
            NotificationLocal('Orden completada','La orden '+data.numOrder+' ha sido entregada y finalizada')
            readAPINotifiactionsTask()
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
            console.log(userCredentials)
            setHistoryView(<History
             UserCred = {userCredentials}
            />)
        })
    },[])
       return(
           <View style = {styles.container}>
            <Header
              Title={'FRONT PANEL'}
            />
            <ScrollView 
            
            style = {{width:'100%'}}>
            <View style = {{width:'100%',height:'100%',alignItems:'center'}}>
            <TouchableOpacity
             style = {{
                 height:30,
                 width:'90%',
                 backgroundColor:'#0564B3',
                 marginVertical:5,
                 alignItems:'center',
                 justifyContent:'center',
                 flexDirection:'row'
                 
             }}
             onPress = {()=>{
                 refreshTasks()
             }}
            >
                <Image
                 source = {require('../Images/refresh.png')}
                 style={{width:20,height:20}}
                />
                <Text
                 style={{color:'white'}}
                > Actualizar tareas</Text>
            </TouchableOpacity>
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
            <TouchableOpacity
             style = {styles.btnNotifications}
             onPress = {()=>{
                 if(toogleList){
                    setViewListNotifiactions()
                    setToogleList(false)
                 }else{
                    
                    setViewListNotifiactions(<ListNotification
                     notifi = {notificationsAPI}
                    />)
                    writeNumberNotifications(taskNotifiNum.toString())
                    readNumbreNotifications(notificationsAPI.length)
                    setToogleList(true)
                 }
             }}
            >
                <Image
                 source = {require('../Images/notificacion.png')}
                 style = {{width:30,height:30}}
                />
                {sizeTasks}
            </TouchableOpacity>
            {viewListNotifications}
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
    },
    btnNotifications:{
        width:45,
        height:45,
        borderRadius:45/2,
        backgroundColor:'white',
        position:'absolute',
        alignItems:'center',
        justifyContent:'center',
        left:60,
        top:5
    }
})

export default TaskService;