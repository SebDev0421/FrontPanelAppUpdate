import React ,{useState, useEffect}from 'react';
import{
    View,
    Text,
    Animated,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image
}from 'react-native';
 
import EventEmmiter from 'react-native-eventemitter';

import APIdata from '../Src/APIdata';
import Socket from '../Src/SocketListener';
import BtnExpandCard from '../Components/BtnExpandCard';

import CheckBox from 'react-native-check-box';



const APIRefreshTask = (find,process) => {
    fetch(APIdata.URI+'/pushTask',{
        method:'PUT',
        body: JSON.stringify({_id:find,process:process}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
      .then(res =>{ console.log(res)})
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
              EventEmmiter.emit('onPushNewTask',res.status) 
          }
          
      })
      .catch(e => console.log(e))
      
}

var modifyVector = []
const CheckBoxRender = (props) => {
    let [toogleMarker,setToogleMarker] = useState(parseInt(props.state))
    useEffect(()=>{
       modifyVector = AuxTasks
    })
    return(
        <View
                 style = {{flexDirection:'row',alignItems:'center'}}
                >
                <Text>{props.Name}</Text>
                <CheckBox
                 onClick={()=>{
                    var sendMarker = 0
                     if(!toogleMarker === true){
                       sendMarker = 1    
                     }
                     modifyVector[props.indexTask-1] = {name:props.Name,flag:sendMarker}
                     
                     setToogleMarker(!toogleMarker)
                     APIRefreshTask(props.Order,modifyVector)
                 }}
                 isChecked = {toogleMarker}
                />
            </View>
    ) 
}




var index = 0
var AuxTasks = []

const ExpanCard = (props) =>{
    let [taskData, setTaskData] = useState([])
    let [taskPush,setTaskPush] = useState([])
    useEffect(()=>{
        setTaskData(props.task)
        AuxTasks = []
        props.task.map((value)=>{
            AuxTasks.push(value[0])
        }) 
        setTaskPush(AuxTasks)
        index = 0
    },[])
    return(
        <View
         style={{width:'100%',alignItems:'center'}}
        >
        <View
        >
            <Text
             style = {styles.TitleProps}
            >Concepto</Text>
            <Text>{props.dataExpand.concept}</Text>
        </View>
        <Text
         style = {styles.TitleProps}
        >Procesos</Text>
            {taskData.map((taskRead)=>{
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
        <View>
            <Text
             style = {styles.TitleProps}
            >Fecha de entrega</Text>
            <Text>{props.dataExpand.finishDate}</Text>
        </View>
        <View>
            <Text
             style = {styles.TitleProps}
            >Observaciones</Text>
            <Text>{props.dataExpand.observations}</Text>
        </View>
        <View
         style={styles.containerBtn}
        >
            <TouchableOpacity
             style={styles.btnFinishOrder}
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

const AlertDate = ()=>{
    return(
        <View
         style={{
             position:'absolute',
             left:-5,
             top:-5
         }}
        >
            <Image
             source = {require('../Images/alerta.png')}
             style = {{width:35,height:35}}
            />
        </View>
    )
}




const CardTask = (props)=>{
    let [expandView,setExpandView] = useState()
    let [boolExpand,setBoolExpand] = useState(false)
    let [arrowChange, setArrowChange] = useState(<Image source = {require('../Images/arrowdown.png')} style={{width:30,height:30}}/>)
    let [btnSecond,setBtnSecond] = useState()
    let [viewAlert,setViewAlert] = useState()
    let [taskPass , setTaskPass] = useState([])
    useEffect(()=>{
        setTaskPass(props.dataTask.process)
        EventEmmiter.on('onEnableBtnDelete',()=>{
            setBtnSecond(
                <TouchableOpacity
                 style = {{position:'absolute',top:50,right:10}}
                 onPress = {()=>{
                  console.log('send ',props.dataTask.numOrder)
                  fetch(APIdata.URI+'/deleteTasks',{
                    method:'PUT',
                    body:JSON.stringify({numOrder:props.dataTask.numOrder}),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                  }).then(res => res.json())
                  .then(res => {
                      if(res === 'ok'){
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

        const dataFinish = props.dataTask.finishDate
        const concated = dataFinish.split('-')
        var concatDates = ''
        concated.map((values)=>{
            concatDates += values
        })
        
        const dateNow =  new Date()

        var dateyear =  dateNow.getFullYear().toString()
        var dateMonth =  (dateNow.getMonth()+1).toString()
        var dateDay =  (dateNow.getMonth()).toString()
        if(parseInt(dateMonth)<10){
            dateMonth = '0'+dateMonth
        }
        if(parseInt(dateDay)<10){
            dateDay = '0'+dateDay
        }
        const dateActually = dateyear + dateMonth + dateDay
        //console.log(dateActually)
        if(parseInt(dateActually)>parseInt(concatDates)){
            setViewAlert(<AlertDate/>)
        }else{
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

        EventEmmiter.on('onPushNewTask',(data)=>{
            setTaskPass(data)
        })
    },[])



    return(
        <View style={styles.containerCard}>
        
           <Text
            style={styles.TitleCard}
           >Orden {props.dataTask.numOrder}</Text>
           <View
            style={{width:'100%'}}
           >
           <Text 
            style={{marginHorizontal:20}}
           >Ordenante: {props.dataTask.payer}</Text>
           <Text
            style={{marginHorizontal:20}}
           >Unidades: {props.dataTask.uds}</Text>
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
                    setExpandView(<ExpanCard
                      task = {taskPass}
                      dataExpand = {props.dataTask}
                    />)
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