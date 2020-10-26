import React ,{useEffect, useState}from 'react';
import{
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';

import CheckBox from 'react-native-check-box';
import APIdata from '../Src/APIdata';
import EventEmitter from 'react-native-eventemitter';

const CheckBoxRender = (props)=>{
    let [marker, setMarker] = useState()
    useEffect(()=>{
        if(parseInt(props.task.flag)){
            setMarker(true)
        }else{
            setMarker(false)
        }
    },[])
    return(
        <View
         style = {{flexDirection:'row',marginVertical:5}}
        >
            <Text>{props.task.name}</Text>
            <CheckBox
             isChecked = {marker}
             onClick = {()=>{
                 return true
             }}
            />
        </View>
    )
}
const ExpandView = (props)=>{
    let [datEndNewFormat,setDateEndNewFormat] = useState('')
    useEffect(()=>{
       const DateEnd= props.dataExpand.finishDate
       const spliterDateEnd = DateEnd.split('-')
       
       const dayEnd = spliterDateEnd[2]
       const MonthEnd = spliterDateEnd[1]
       const yearEnd = spliterDateEnd[0]
       
       setDateEndNewFormat(dayEnd+'-'+MonthEnd+'-'+yearEnd)
    })
    return(
        <View
         style={{width:'100%', alignItems:'center'}}
        >
            <View
             style = {{alignItems:'center',width:'90%'}}
            >
                <Text
                 style = {styles.TitleProps}
                >
                    Concepto
                </Text>
                <Text>{props.dataExpand.concept}</Text>
            </View>
            <View
             style = {{alignItems:'center',width:'70%'}}
            >
            <Text
             style = {styles.TitleProps}
            >Procesos</Text>
            {
                props.dataExpand.process.map((value)=>{
                    return(
                        <View>
                            <CheckBoxRender
                              task = {value[0]}
                            />
                        </View>
                    )
                })
            }
            </View>
            <View
             style = {{alignItems:'center',width:'70%'}}
            >
            <Text
             style = {styles.TitleProps}
            >Fecha de entrega</Text>
             <Text>{datEndNewFormat}</Text>
            </View>
            <View
             style = {{alignItems:'center',width:'70%'}}
            >
             <Text
              style = {styles.TitleProps}
             >Observaciones</Text>
             <Text
              style = {{marginVertical:5}}
             >{props.dataExpand.observations}</Text>
             </View>
            </View>
    )
}

const APIDeleteTask = (_id,numOrder)=>{
    fetch(APIdata.URI+'/deleteTaskHistory',{
        method: 'PUT',
        body:JSON.stringify({_id:_id}),
        headers:{
            'Content-Type' : 'application/json'
        }
    }).then(res => res.json())
      .then(res =>  {
          if(res.status === 37){
              EventEmitter.emit('onDeleteHistoryOrder',numOrder)
              Alert.alert('Orden eliminada del historial','La orden '+ numOrder +' ha sido eliminada')
          }
      })
}

const CardHistory = (props) => {
    let [boolExpand,setBoolExpand] = useState(false)
    let [arrowChange, setArrowChange] = useState(<Image source = {require('../Images/arrowdown.png')} style={{width:30,height:30}}/>)
    let [expandView,setExpandView] = useState()
    let [dateNewFormat, setDateNewFormat] = useState('')
    let [btnEliminate, setBtnEliminate] = useState(<TouchableOpacity
        style = {{position:'absolute',top:12,right:60}}
        onPress={()=>{
            Alert.alert('Eliminar orden','Esta seguro de eliminar la orden del historial',
            [
                {
                    text:'Cancelar',
                    style:'cancel'
                },
                {
                    text:'Confirmar',
                    onPress:()=>{
                        
                        APIDeleteTask(props.dataCard._id,props.dataCard.numOrder)
                    }
                }
            ]
            )
        }}
       >
           <Image
            source = {require('../Images/cerrarGray.png')}
            style={{width:22,height:22}}
           />
       </TouchableOpacity>)
    useEffect(()=>{


        const dateBeginComplete = props.dataCard.createDate
        const SepareData = dateBeginComplete.split(' ')
        const dateBegin = SepareData[0]
        const hourBegin = SepareData[1]
        
        const dateBeginSpliter = dateBegin.split('-')

        
        setDateNewFormat(dateBeginSpliter[2]+'-'+dateBeginSpliter[1]+'-'+dateBeginSpliter[0]+' '+hourBegin)

        if(props.roll === '2'){
            setBtnEliminate()
        }
        
    })
    return(
        <View
         style = {styles.container}
        >
        <View
         style = {{
             width:'100%',
             alignItems:'flex-start'
         }}
        >
            <View
             style = {{
                 width:'75%',
                 alignItems:'center'
             }}
            >
            <Text
             style = {styles.TitleCard}
            >Orden {props.dataCard.numOrder}</Text>
            </View>
            </View>
            <Text
             style = {{
                 fontWeight:'bold'
             }}
            >
                Fecha de creación
            </Text>
            <Text
             style={styles.subText}
            >{dateNewFormat}</Text>
            <Text
             style = {{
                 fontWeight:'bold'
             }}
            >
                Fecha de entrega
            </Text>
            <Text
             style={styles.subText}
            >{props.dataCard.DepartedDate}</Text>
            <View
            style={{marginHorizontal:20,marginVertical:5,flexDirection:'row'}}
           >
           <Text 
            style={{fontWeight:'bold'}}
           >Ordenante:</Text>
           <Text>{props.dataCard.payer}</Text>
           </View>
           <View
              style={{marginHorizontal:20,marginVertical:5,flexDirection:'row'}}
           >
           <Text
            style={{fontWeight:'bold'}}
           >Unidades:</Text>
           <Text>
           {props.dataCard.uds}
           </Text>
           </View>
            {expandView}
            {btnEliminate}
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
                    setExpandView(<ExpandView
                      dataExpand = {props.dataCard}
                    />)
                }
            }}
           >
               {arrowChange}
           </TouchableOpacity>
           
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'95%',
        backgroundColor:'white',
        borderRadius:15,
        marginVertical:15,
        alignItems:'center'
    },
    TitleCard:{
        fontWeight:'bold',
        fontSize:22,
        marginVertical:15
    },
    subText:{
        marginVertical:5
    },
    TitleProps:{
        marginVertical:7,
        fontSize:18,
        fontWeight:'bold'
    }
})

export default CardHistory;



