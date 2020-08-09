import React ,{useEffect, useState}from 'react';
import{
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';


const CardHistory = (props) => {
    let [boolExpand,setBoolExpand] = useState(false)
    let [arrowChange, setArrowChange] = useState(<Image source = {require('../Images/arrowdown.png')} style={{width:30,height:30}}/>)
    return(
        <View
         style = {styles.container}
        >
            <Text>Orden 1313</Text>
            <Text>Ordenante: juan</Text>
            <Text>Unidades: 156</Text>
            <TouchableOpacity
            style = {{position:'absolute',top:10,right:10}}
            onPress = {()=>{
                if(boolExpand){
                    setArrowChange(<Image source = {require('../Images/arrowdown.png')} style={{width:30,height:30}}/>)
                    /* setExpandView() */
                    setBoolExpand(false)
                }else{
                    setArrowChange(<Image source = {require('../Images/arrowup.png')} style={{width:30,height:30}}/>)
                    setBoolExpand(true)
                    /* setExpandView(<ExpanCard
                      task = {taskPass}
                      dataExpand = {props.dataTask}
                    />) */
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
        height:100,
        backgroundColor:'white',
        borderRadius:15,
        marginVertical:15
    }
})

export default CardHistory;



