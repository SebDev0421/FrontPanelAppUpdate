import React,{useState,useEffect} from 'react';
import{
    View,
    Text,
    TextInput,
    TouchableNativeFeedback,
    Image,
    ScrollView,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Alert
} from 'react-native'



import APIdata from '../Src/APIdata'
import Socket from '../Src/SocketListener';

import DatePicker from 'react-native-datepicker';

import EventEmitter from 'react-native-eventemitter';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
};


var listOrders = [];

const APInewOrder = (ordenante,numOrder,concept,uds,process,finishDate,observations,id,nameUser) =>{
    fetch(APIdata.URI+'/addNewTask',{
        method:'PUT',
        body: JSON.stringify({payer:ordenante,numOrder:numOrder,concept:concept,uds:uds,process:process,finishDate:finishDate,observations:observations,createdId:id}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
     .then(res => {
         console.log(res)
         if(res.status === 78){
             Socket.emit('onNewOrder',{
                 numOrder:numOrder,
                 name:nameUser
             })
             alert('La orden fue creada')
             EventEmitter.emit('onCloseCreateOrder',true)
             return 0
         }
         alert('Este numero de orden ya existe')
     })
     .catch(e=>console.log(e))
}



const CreateOrder = (props)=>{
    let [tasks,setTasks] = useState('');
    let [indexItem, setIndexItem] = useState(0)
    let [dateValue,setDateValue] = useState('')
    let [ordenante,setOrdenante] = useState('')
    let [numOrder,setNumOrder] = useState('')
    let [concept,setConcept] = useState('')
    let [sizeOrder,setSizeOrder] = useState('')
    let [observations,setObservations] = useState('')
    let [styleBtn, setStyleBtn] = useState(false)
    let [idUser, setIdUser] = useState('')
    let [nameUser,setNameUser] = useState('')
    
    useEffect(()=>{
        setIdUser(props.userCred._id)
        setNameUser(props.userCred.name)
    },[])

    return(
        <View style = {styles.container}>
            <View style={styles.boxAddTask}>
                <View style = {styles.header}>
                  <Text
                   style={{color:'white',fontWeight:'bold',fontSize:20}}
                  >Crea una orden</Text>
                  <TouchableOpacity
                    style={styles.btnClose}
                    onPress={()=>{
                        EventEmitter.emit('onCloseCreateOrder',true);
                    }}
                  >
                      <Image source={require('../Images/arrowleft.png')} style={{width:25,height:25}}/>
                  </TouchableOpacity>
                </View>
                <ScrollView 
                onScroll={({nativeEvent}) => {
                    if (isCloseToBottom(nativeEvent)) {
                        setStyleBtn(true)
                    }else{
                        setStyleBtn(false)
                    }
                }}
                style={{width:'100%'}}>
                <View style={styles.dataInput}>
                <Text>Ordenante</Text>
                <TextInput
                 placeholder = {'Ordenante *'}
                 style={styles.TextInputPrimary}
                 returnKeyType = 'next'
                 onChangeText = {(value) => {
                     setOrdenante(value)
                 }}
                />
                <Text>No orden</Text>
                <TextInput
                 placeholder = {'No orden *'}
                 style={styles.TextInputPrimary}
                 keyboardType={'numeric'}
                 onChangeText = {(value) => {
                    setNumOrder(value)
                }}
                />
                <Text>Concepto</Text>
                <ScrollView style={{width:'100%'}}>
                 <View
                  style={{width:'100%',alignItems:'center'}}
                 >
                 <TextInput
                  placeholder = {'Agegar concepto *'}
                  multiline
                  style = {styles.TextInputSecondary}
                  onChangeText = {(desc)=>{
                      setConcept(desc)
                  }}
                 />
                 </View>
                </ScrollView>
                <Text>Unidades</Text>
                <TextInput
                 placeholder = {'Unidades'}
                 style={styles.TextInputPrimary}
                 keyboardType={'numeric'}
                 onChangeText = {(value) => {
                    setSizeOrder(value)
                 }}
                />
                <Text>Agregar procesos</Text>
                 <View
                  style={[styles.TextInputPrimary,{flexDirection:'row',alignItems:'center'}]}
                 >
                  <TextInput
                  placeholder = {'Agrega un proceso'}
                  onChangeText={(value)=>{
                      setTasks(value)
                  }}
                  value={tasks}
                  style={{width:'80%'}}
                  />
                  <TouchableOpacity
                   style={{position:'absolute',right:5}}
                   onPress={()=>{
                       if(tasks !== ''){
                       listOrders.push({
                           name:tasks,
                           flag:0
                       })
                       setTasks('')
                       setIndexItem(listOrders.length)
                    }
                   }}
                  >
                      <Image source={require('../Images/addTask.png')} style={{width:25,height:25}}/>
                  </TouchableOpacity>                  
                 </View>
                <Text>Procesos agregados {indexItem}</Text>
                 <View>
                     {listOrders.map((value)=>{
                         return(
                             <View 
                             key={value.name}
                             style={{flexDirection:"row",marginVertical:5}}>
                                 <Text >{value.name}</Text>
                                 <TouchableOpacity
                                   style={{marginHorizontal:5}}
                                   onPress={()=>{
                                       listOrders.splice(listOrders.indexOf(value),1)
                                       setIndexItem(listOrders.length)
                                   }}
                                 >
                                     <Image source = {require('../Images/deleteTask.png')} style={{width:25,height:25}}/>
                                 </TouchableOpacity>
                             </View>
                         )
                     })}
                 </View>
                 <Text>Fecha de entrega</Text>
                 <DatePicker
                  placeholder = {'Define la fecha de entrega'}
                  style={{width:'90%'}}
                  mode={'date'}
                  date={dateValue}
                  onDateChange = {(date)=>{
                      console.log(date)
                      setDateValue(date)
                  }}
                 />
                 <Text>Observaciones</Text>
                 <ScrollView style={{width:'100%'}}>
                 <View
                  style={{width:'100%',alignItems:'center'}}
                 >
                 <TextInput
                  placeholder = {'Agegar Observacion'}
                  multiline
                  style = {styles.TextInputSecondary}
                  onChangeText = {(value) => {
                    setObservations(value)
                }}
                 />
                 </View>
                </ScrollView>
                </View>
                </ScrollView>
                <TouchableOpacity
                 style={styleBtn ? styles.btnAddSecondary : styles.btnAdd }
                 onPress = {()=>{
                     if(styleBtn){
                        if(dateValue == '' || ordenante == '' || numOrder == '' || concept == '' || sizeOrder == ''){
                            alert('hay campos obligatorios sin llenar')
                            return 0
                        }
                        if(listOrders.length == 0){
                            alert('No has creado procesos')
                            return 0
                        }
                        Alert.alert(
                            "Crear nueva orden",
                            "Esta seguro de crear esta nueva orden",
                            [
                                {
                                    text:"No",
                                    onPress: ()=> console.log('order Canceled') 
                                },
                                {
                                    text:"Si",
                                    onPress: ()=> {APInewOrder(ordenante,numOrder,concept,sizeOrder,listOrders,dateValue,observations,idUser,nameUser)} 
                                }
                            ],
                        )
                     }
                 }}
                >
                    <Text style = {{color:'white', fontWeight:'bold'}}>Agregar orden</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        top:0,
        left:0,
        width:'100%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    boxAddTask:{
        backgroundColor:'#FFFF',
        width:'90%',
        height:'90%',
        borderRadius:15,
        alignItems:'center'
    },header:{
        width:'100%',
        height:50,
        backgroundColor:'#0564B3',
        alignItems:'center',
        justifyContent:'center',
        borderBottomEndRadius:25,
        borderBottomStartRadius:25,
        marginBottom:15
    },
    dataInput:{
        width:'100%',
        height:'100%',
        alignItems:'center',
        marginBottom:10
    },
    TextInputPrimary:{
        width:'90%',
        height:50,
        borderWidth:1,
        borderColor:'gray',
        borderRadius:10,
        marginBottom:10
    },
    TextInputSecondary:{
        width:'90%',
        height:150,
        borderWidth:1,
        borderColor:'gray',
        borderRadius:10,
        marginBottom:10,
    },
    btnAdd:{
        height:50,
        width:'90%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'gray',
        borderRadius:10,
        marginVertical:10
    },
    btnAddSecondary:{
        height:50,
        width:'90%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#0564B3',
        borderRadius:10,
        marginVertical:10
    },
    btnClose:{
        position:'absolute',
        left:10,
    }
})

export default CreateOrder;