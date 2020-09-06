import React,{useRef,useEffect,useState} from 'react';
import{
    View,
    AppState,
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
var count_notifications = 0;
const NotificationLocal = (title,body)=>{
    
    console.log('notification pass',count_notifications);
    if(count_notifications < 1){
    Notifications.postLocalNotification({
      title:title,
      body:body          
    })
    }
    count_notifications ++;
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
    let [numbersNot,setNumbewNot] = useState(0)
    let [sizeTasks, setSizeTasks] = useState()
    let [viewListNotifications, setViewListNotifiactions] = useState()
    let [toogleList, setToogleList] = useState(false)
    let [taskNotifiNum, setTaskNotifiNum] = useState(0)
    let [tokenDevice, setTokenDevice] = useState('')

    const writeNumberNotifications = async(value)=>{
        try{
            await AsyncStorage.setItem('numNotificationsView',value)
        }catch(e){
            console.log(e)
        }
    }

    const addForeground = async ()=>{
        const numNotViews = await AsyncStorage.getItem('numNotificationsView');
        var newData = parseInt(numNotViews) 
        newData = newData + 1
        console.log('add data',newData)
        try{
            await AsyncStorage.setItem('numNotificationsView',newData.toString())
            setNumbewNot(newData.toString())
        }catch(e){
            console.log(e)
        }
    }

    const readNumbreNotifications = async()=> {
        const numNotViews = await AsyncStorage.getItem('numNotificationsView');
        
        if(numNotViews === null){
            setNumbewNot('0')
        }else{
            setNumbewNot(numNotViews)
        }
    }

    readNumbreNotifications()
    

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
                //readNumbreNotifications(vectorRead.length)
                setTaskNotifiNum(vectorRead.length)
        }
        // read API 
        readAPITask()
        readAPINotifiactionsTask()
    }

    const _handleAppStateChange = (nextAppState)=>{
        if(nextAppState === 'active'){
            refreshTasks()
        }
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


        AppState.addEventListener('change',
         _handleAppStateChange
        )

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
                //readNumbreNotifications(vectorRead.length)
                setTaskNotifiNum(vectorRead.length)
        }


        Notifications.registerRemoteNotifications();

Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
        // TODO: Send the token to my server so it could send back push notifications...
        const getToken = event.deviceToken
        
        const APIToken = (token)=>{
            fetch(APIdata.URI+'/addToken',{
                method:'PUT',
                body:JSON.stringify({TokenDevice:token}),
                headers:{
                    'Content-Type':'application/json'
                }
            }).then(res => res.json())
              .then((res)=>{
                  if(res.status === 200){
                     return true
                  }

              })
              .catch((e)=>{
                  if(e) throw e
              })
        }

        const APIdeleteToken = (token)=>{
            fetch(APIdata.URI+'/deleteToken',{
                method:'PUT',
                body:JSON.stringify({tokenId:token}),
                headers:{
                    'Content-Type':'application/json'
                }
            }).then(res => res.json())
              .then(res => {
                  if(res.status === 200){
                      return true
                  }
              })
              .catch((e)=>{
                  if(e) throw e
              })
        }

        const writeToken = async()=>{
            try{
                await AsyncStorage.setItem('tokenDevice',getToken)
            }catch(e){
                if(e) throw e
            }
        }

        const readToken = async()=>{
            const tokenStorage = await AsyncStorage.getItem('tokenDevice');
            if(tokenStorage !== getToken){
                console.log('delete in api token storage and write token',getToken);
                APIdeleteToken(tokenStorage)
                APIToken(getToken)
                writeToken()
            }else{
                APIToken(getToken)
                console.log('the token is equals')
                console.log(getToken)
            }
        }   

        readToken()
        
});
Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
        console.error(event);
});

Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion: (response: NotificationCompletion) => void) => {
    const ReceivedPayload = notification.payload;
    addForeground();
    readAPITask();
    readAPINotifiactionsTask();
    console.log('Notification detect')
    EventEmmiter.emit('onNotification',ReceivedPayload);
    // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
    //completion({alert: true, sound: true, badge: false});
    });

Notifications.events().registerNotificationReceivedBackground((notification: Notification, completion: (response: NotificationCompletion) => void) => {
        console.log("Notification Received - Background", notification.payload);
        // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
        readAPINotifiactionsTask()
        readAPITask()
        addForeground()
        completion({alert: true, sound: true, badge: false});
});


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
            //NotificationLocal('Se ha creado una Orden','La orden '+data.numOrder+' ha sido creada')
            readAPITask()
        })


        Socket.on('onDatesEditOrder',(data)=>{
            console.log(data)
            //generate Notifications
            //NotificationLocal('Se ha modificado una Orden','La orden '+data.numOrder+' ha sido modificada')
            readAPINotifiactionsTask()
            readAPITask()
        })

        Socket.on('onDatesCompleteOrder',(data)=>{
            console.log(data)
            //generate Notification
            //NotificationLocal('Orden completada','La orden '+data.numOrder+' ha sido entregada y finalizada')
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

        EventEmmiter.on('onNotification',(ReceivedPayload)=>{
            count_notifications = 0;
            NotificationLocal(ReceivedPayload["gcm.notification.title"],ReceivedPayload["gcm.notification.body"])
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

        EventEmmiter.on('onDeleteTaskNotifications',(data)=>{
            count_notifications = 0;
            NotificationLocal('Has eliminado una orden','Has eliminado la orden ' +data)
            readAPITask();
        })

        
        EventEmmiter.on('onDeleteHistoryOrder',(data)=>{
            count_notifications = 0;
            NotificationLocal('Orden eliminada del historial','Has eliminado la orden ' +data)
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
            {actuallyTasks.slice(0).reverse().map((data)=>{
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
                    writeNumberNotifications('0')
                    setNumbewNot('0')
                    setToogleList(true)
                 }
             }}
            >
                <Image
                 source = {require('../Images/notificacion.png')}
                 style = {{width:30,height:30}}
                />
                <IndicatorTask
                numTasks = {numbersNot}
                />
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