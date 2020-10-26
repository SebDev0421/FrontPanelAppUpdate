import React ,{useState, useEffect}from 'react';
import{
    View,
    Text,
    Animated,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert
}from 'react-native';
 
import EventEmmiter from 'react-native-eventemitter';

import APIdata from '../Src/APIdata';
import Socket from '../Src/SocketListener';

import CheckBox from 'react-native-check-box';

const writeAPINotifiactionsTask = async(numOrder,status)=>{
    await fetch(APIdata.URI+'/NotificationsWrite',{
        method:'PUT',
        body: JSON.stringify({numOrder:numOrder,status:status}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
      .then((res) => {
          console.log(res)
          if(res.satus === 200){
              return true
          }
          
      })
      .catch(e=>console.log(e))
}

const APIRefreshTask = (find,process) => {
    fetch(APIdata.URI+'/pushTask',{
        method:'PUT',
        body: JSON.stringify({_id:find,process:process}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
      .then(res =>{
        return 0  
        /* console.log(res) */})
      .catch(e => console.log(e))
}

const APIProcess = async (_id)=>{
    var resObj
    await fetch(APIdata.URI+'/getNewTasks',{
        method:'PUT',
        body: JSON.stringify({_id:_id}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
      .then(res =>{
          if(res.status !== 73 ){
              //console.log('onPushNewTask'+_id)
              console.log(res)
              EventEmmiter.emit('onPushNewTask'+_id,res.status,res.concpet,res.observations,res.date) 
          }
      })
      .catch(e => console.log(e))
      
}


var AuxTasks = []
const CheckBoxRender = (props) => {
    let [toogleMarker,setToogleMarker] = useState(parseInt(props.state))
    return(
        <View
                 style = {[{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:10,width:'90%',marginVertical:5,
                            
                },toogleMarker ? {backgroundColor:'#0564B3'} : {backgroundColor:'#000'}]}
         >
             <View
             style = {{width:'80%'}}
             >
                <Text
                 style={{
                     color:'white',
                     fontWeight:'bold',
                     fontSize:16,
                     marginLeft:6,
                     marginVertical:5
                 }
                 }
                >{props.Name}</Text>
                </View>
                <CheckBox
                 onClick={()=>{
                    var sendMarker = 0
                     if(!toogleMarker === true){
                       sendMarker = 1    
                     }
                     console.log(AuxTasks)
                     AuxTasks[props.indexTask-1] = {name:props.Name,flag:sendMarker}
                     setToogleMarker(!toogleMarker)
                     APIRefreshTask(props.Order,AuxTasks)
                 }}
                 isChecked = {toogleMarker}
                 style = {{
                     position:'absolute',
                     right:10
                 }}

                 checkBoxColor={'white'}
                />
            </View>
    ) 
}


const APISendTaskHistory = (_id,numOrder,DepartedDate)=>{
    fetch(APIdata.URI+'/stateChange',{
        method:'PUT',
        body:JSON.stringify({_id:_id,DepartedDate:DepartedDate}),
        headers:{
            'Content-Type' : 'application/json'
        }
    })
    .then(res => res.json())
    .then(res => {
        if(res.status === 38){
            writeAPINotifiactionsTask(numOrder,4)
            Socket.emit('onCompleteTask',{numOrder:numOrder})
        }
    })
    .catch(e => console.log(e))
}


var index = 0



const ExpanCard = (props) =>{
    let [taskData, setTaskData] = useState([])
    let [taskPush,setTaskPush] = useState([])
    let [dateEndNewFormat, setDateEndNewFormat] = useState('')
    useEffect(()=>{
        AuxTasks = []
        props.task.map((value)=>{
            AuxTasks.push(value[0])
        }) 
       index = 0
       setTaskData(AuxTasks)

       const DateEnd= props.finishDate
       const spliterDateEnd = DateEnd.split('-')
       console.log(spliterDateEnd)
       const dayEnd = spliterDateEnd[2]
       const MonthEnd = spliterDateEnd[1]
       const yearEnd = spliterDateEnd[0]
       
       setDateEndNewFormat(dayEnd+'-'+MonthEnd+'-'+yearEnd)
       
    },[])
    return(
        <View
         style={{width:'100%',alignItems:'center'}}
        >
        <View
         style={{width:'100%',alignItems:'center'}}
        >
            <Text
             style = {styles.TitleProps}
            >Concepto</Text>
        </View>
        <View>
        <Text>{props.concept}</Text>
        </View>
        <Text
         style = {styles.TitleProps}
        >Procesos</Text>
            {props.task.map((taskRead)=>{
                index += 1
                return(
                 <CheckBoxRender
                  Name = {taskRead[0].name}
                  state = {taskRead[0].flag}
                  indexTask = {index}
                  taskArray = {taskPush}
                  Order = {props.dataExpand._id}
                 />
                )
                
                
            })}
        <View
         style = {{width:'100%',alignItems:'center'}}
        >
            <Text
             style = {styles.TitleProps}
            >Fecha de entrega</Text>
            <View
             style = {[{width:'85%',height:35,alignItems:'center',justifyContent:'center',borderRadius:10},{backgroundColor:props.dateAlert}]}
            >
            <Text
             style = {{color:'white',fontWeight:'bold'}}
            >{dateEndNewFormat}</Text>
            </View>
        </View>
        <View
         style = {{width:'100%',alignItems:'center'}}
        >
            <Text
             style = {styles.TitleProps}
            >Observaciones</Text>
        </View>
        <View>
        <Text>{props.observations}</Text>
        </View>
        <View
         style={styles.containerBtn}
        >
            <TouchableOpacity
             style={styles.btnFinishOrder}
             onPress = {()=>{
                 Alert.alert(
                     "Terminar orden",
                     "Desea entregar la orden",
                     [{
                         text:"Cancelar",
                         style:"cancel"
                     },
                     {
                         text:"Entregar",
                         onPress:()=>{
                            const date = new Date()
                            var month = parseInt(date.getMonth())+1
                            var hour = date.getHours()
                            var minutes = date.getMinutes()
                            var day = date.getDate()
                            if(month<10){
                                month = '0'+month; 
                            }
                            if(minutes < 10){
                                minutes = '0'+minutes
                            }
                            if(hour < 10){
                                hour = '0'+hour
                            }
                            if(day < 10){
                                day = '0'+day
                            }
                            const today = day+'-'+month+'-'+date.getFullYear() +' '+hour+':'+minutes

                             APISendTaskHistory(props.dataExpand._id,props.dataExpand.numOrder,today)
                         }
                     }
                    ]
                 )
             }}
            >
                <Text
                 style={styles.textBtn}
                >
                    Entregar orden
                </Text>
            </TouchableOpacity>
        </View>
        </View>
    )
}

const AlertDate = (props)=>{
    return(
        <View
         style={{
             position:'absolute',
             left:-5,
             top:-5
         }}
        >
            <Image
             source = {props.img}
             style = {{width:35,height:35}}
            />
        </View>
    )
}


let colorDate


const CardTask = (props)=>{
    let [expandView,setExpandView] = useState()
    let [boolExpand,setBoolExpand] = useState(false)
    let [arrowChange, setArrowChange] = useState(<Image source = {require('../Images/arrowdown.png')} style={{width:30,height:30}}/>)
    let [btnSecond,setBtnSecond] = useState()
    let [viewAlert,setViewAlert] = useState()
    let [taskPass , setTaskPass] = useState([])

    let [dateNewFormat, setDateNewFormat] = useState('')
    useEffect(()=>{
        console.log(props.dataTask.concept)
        setTaskPass(props.dataTask.process)
        EventEmmiter.on('onEnableBtnDelete',()=>{
            setBtnSecond(
                <TouchableOpacity
                 style = {{position:'absolute',top:50,right:10}}
                 onPress = {()=>{
                  //console.log('send ',props.dataTask.numOrder)
                  fetch(APIdata.URI+'/deleteTasks',{
                    method:'PUT',
                    body:JSON.stringify({numOrder:props.dataTask.numOrder}),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                  }).then(res => res.json())
                  .then(res => {
                      if(res === 'ok'){
                          EventEmmiter.emit('onDeleteTaskNotifications',props.dataTask.numOrder)
                          Socket.emit('onDeleteTask',{name:props.userCred.name,number:props.dataTask.numOrder})
                      }
                  })
                  .catch(e=>{console.log(e)})
            }}
           >
               <Image source = {require('../Images/eliminar.png')} style={{width:25,height:25}}/>
           </TouchableOpacity>
            )
        })
        colorDate = false
        var dataFinish = props.dataTask.finishDate
        var concated = dataFinish.split('-')
        var concatDates = ''
        concated.map((values)=>{
            concatDates += values
        })
        
        const dateNow =  new Date()

        var dateyear =  dateNow.getFullYear().toString()
        var dateMonth =  (dateNow.getMonth()+1).toString()
        var dateDay =  (dateNow.getDate()).toString()
        if(parseInt(dateMonth)<10){
            dateMonth = '0'+dateMonth
        }
        if(parseInt(dateDay)<10){
            dateDay = '0'+dateDay
        }
        const dateActually = dateyear + dateMonth + dateDay
        
        if(parseInt(dateActually)>parseInt(concatDates)){
            colorDate = '#D31812' 
            setViewAlert(<AlertDate
             img = {require('../Images/alerta.png')}
            />)
        }
        else if(parseInt(dateActually)===parseInt(concatDates)){
            colorDate = '#F6E920'
            setViewAlert(<AlertDate
             img = {require('../Images/error.png')}
            />)
        }
        else{
            colorDate = '#23D312'
            setViewAlert()
        }

        EventEmmiter.on('onEnableBtnEdit',()=>{
            setBtnSecond(
                <TouchableOpacity
            style = {{position:'absolute',top:50,right:10}}
            onPress = {()=>{
                EventEmmiter.emit('onOpenEditOrder',props.dataTask)
            }}
           >
               <Image source = {require('../Images/edit.png')} style={{width:25,height:25}}/>
           </TouchableOpacity>
            )
        })
        EventEmmiter.on('onDisableBtnDelete',()=>{
            setBtnSecond()
        })

        EventEmmiter.on('onPushNewTask'+props.dataTask._id,(data,concept,observations,date)=>{
        var dateyear =  dateNow.getFullYear().toString()
        var dateMonth =  (dateNow.getMonth()+1).toString()
        var dateDay =  (dateNow.getDate()).toString()
        if(parseInt(dateMonth)<10){
            dateMonth = '0'+dateMonth
        }
        if(parseInt(dateDay)<10){
            dateDay = '0'+dateDay
        }
        const dateActually = dateyear + dateMonth + dateDay
        colorDate = false
        dataFinish = date
        concated = dataFinish.split('-')
        concatDates = ''
        concated.map((values)=>{
            concatDates += values
        })
        
        if(parseInt(dateActually)>parseInt(concatDates)){
            colorDate = '#D31812' 
            setViewAlert(<AlertDate
             img = {require('../Images/alerta.png')}
            />)
        }
        else if(parseInt(dateActually)===parseInt(concatDates)){
            colorDate = '#F6E920'
            setViewAlert(<AlertDate
             img = {require('../Images/error.png')}
            />)
        }
        else{
            colorDate = '#23D312'
            setViewAlert()
        }

        console.log(props.dataTask.concept)
        
        setExpandView(<ExpanCard
            task = {data}
            dataExpand = {props.dataTask}
            dateAlert = {colorDate}
            concept = {concept}
            observations = {observations}
            finishDate = {date}
        />)
        })

        const dateBeginComplete = props.dataTask.createDate
        const SepareData = dateBeginComplete.split(' ')
        const dateBegin = SepareData[0]
        const hourBegin = SepareData[1]
        
        const dateBeginSpliter = dateBegin.split('-')

        
        setDateNewFormat(dateBeginSpliter[2]+'-'+dateBeginSpliter[1]+'-'+dateBeginSpliter[0]+' '+hourBegin)

    },[])



    return(
        <View style={styles.containerCard}>
        
           <Text
            style={styles.TitleCard}
           >Orden {props.dataTask.numOrder}</Text>
           <Text
            style = {{
                marginVertical:5,
                fontWeight:'bold'
            }}
           >
               Fecha de creación
           </Text>
           <Text>
               {dateNewFormat}
           </Text>
           <View
            style={{width:'100%',alignItems:'center'}}
           >
           <View
            style={{marginHorizontal:20,marginVertical:5,flexDirection:'row'}}
           >
           <Text 
            style={{fontWeight:'bold'}}
           >Ordenante:</Text>
           <Text>{props.dataTask.payer}</Text>
           </View>
           <View
              style={{marginHorizontal:20,marginVertical:5,flexDirection:'row'}}
           >
           <Text
            style={{fontWeight:'bold'}}
           >Unidades:</Text>
           <Text>
           {props.dataTask.uds}
           </Text>
           </View>
           
           </View>
           {expandView}           
           <View
            style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginVertical:15}}
           >
           </View>
           <TouchableOpacity
            style = {{position:'absolute',top:10,right:10}}
            onPress = {()=>{
                if(boolExpand){
                    setArrowChange(<Image source = {require('../Images/arrowdown.png')} style={{width:30,height:30}}/>)
                    setExpandView()
                    setBoolExpand(false)
                }else{
                    setArrowChange(<Image source = {require('../Images/arrowup.png')} style={{width:30,height:30}}/>)
                    setBoolExpand(true)
                    APIProcess(props.dataTask._id)
                }
            }}
           >
               {arrowChange}
           </TouchableOpacity>
           {btnSecond}
           {viewAlert}
        </View>
    )
}

const styles = StyleSheet.create({
    containerCard:{
        width:'95%',
        backgroundColor:'white',
        borderRadius:15,
        alignItems:'center',
        marginVertical:15
    },
    TitleCard:{
        fontWeight:'bold',
        fontSize:22,
        marginVertical:15
    },
    TitleProps:{
        marginVertical:7,
        fontSize:18,
        fontWeight:'bold'
    },
    containerPropieties:{
        width:'100%'
    },
    containerBtn:{
        width:'100%',
        alignItems:'center',
        marginTop:20
    },
    btnFinishOrder:{
        width:'80%',
        height:50,
        borderRadius:15,
        backgroundColor:'#0564B3',
        alignItems:'center',
        justifyContent:'center'
    },
    textBtn:{
        color:'white',
        fontWeight:'bold'
    }
})


export default CardTask;