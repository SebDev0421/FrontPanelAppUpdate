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
            />
        </View>
    )
}
const ExpandView = (props)=>{
    return(
        <View
         style={{width:'100%', alignItems:'center'}}
        >
            <View>
                <Text
                 style = {styles.TitleProps}
                >
                    Concepto
                </Text>
                <Text>{props.dataExpand.concept}</Text>
            </View>
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
            </View>
    )
}

const APIDeleteTask = (_id)=>{
    fetch(APIdata.URI+'/deleteTaskHistory',{
        method: 'PUT',
        body:JSON.stringify({_id:_id}),
        headers:{
            'Content-Type' : 'application/json'
        }
    }).then(res => res.json())
      .then(res =>  {
          if(res.status === 37){
              EventEmitter.emit('onDeleteHistoryOrder',true)
              Alert.alert('Orden eliminada del historial','La orden a sido eliminada')
          }
      })
}

const CardHistory = (props) => {
    let [boolExpand,setBoolExpand] = useState(false)
    let [arrowChange, setArrowChange] = useState(<Image source = {require('../Images/arrowdown.png')} style={{width:30,height:30}}/>)
    let [expandView,setExpandView] = useState()
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
                        APIDeleteTask(props.dataCard._id)
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

        if(props.roll === '2'){
            setBtnEliminate()
        }
        
    })
    return(
        <View
         style = {styles.container}
        >
            <Text
             style = {styles.TitleCard}
            >Orden {props.dataCard.numOrder}</Text>
            <Text
             style={styles.subText}
            >Ordenante: {props.dataCard.payer}</Text>
            <Text
             style={styles.subText}
            >Unidades: {props.dataCard.uds}</Text>
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



