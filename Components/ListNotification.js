import React from 'react';
import{
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';



const DataDeploy = (props) => {

    return(
        <View
         style = {styles.cardNotifications}
        >
            
            <Text
             style = {styles.TitleNot}
            >{props.payer}</Text>
            <View
             style = {styles.body}
            >
              <Text>{props.numOrder}</Text>
            </View>
        </View>
    )
}

const ListNotification = (props) => {
    return(
        <View
         style = {styles.container}
        >
            <ScrollView
             style = {styles.ScrollSet}
            >
                {props.notifi.slice(0).reverse().map((value)=>{
                    switch(value.status){
                        case '1' : return(
                            <DataDeploy
                        payer = {'Orden creada'}
                        numOrder = {'Se ha creado la orden '+value.numOrder}
                    />   
                    )
                    case '2' : return(
                        <DataDeploy
                    payer = {'Orden editada'}
                    numOrder = {'Se ha editado la orden '+value.numOrder}
                />   
                )
                case '3' : return(
                    <DataDeploy
                payer = {'Orden eliminada'}
                numOrder = {'Se ha eliminado la orden '+value.numOrder}
            />   
            )
            case '4' : return(
                <DataDeploy
            payer = {'Orden Completada'}
            numOrder = {'Se ha completado la orden '+value.numOrder}
        />   
        )
                    }
                    
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        width:'70%',
        height:'50%',
        backgroundColor:'white',
        shadowColor :'#000',
        shadowOffset:{width: 0, height: 2},
        shadowOpacity:0.5,
        shadowRadius:2,
        elevation:2,
        top:65,
        left:15
    },
    ScrollSet:{
        width:'100%',
        height:'95%'
    },
    cardNotifications:{
        width:'95%',
        marginVertical:5,
        borderBottomColor:'gray',
        borderBottomWidth:1
    },
    TitleNot:{
        fontWeight:'bold',
        fontSize:17,
        marginBottom:4,
        marginLeft:5
    },
    body:{
        marginBottom:5,
        alignItems:'center'
    }
})

export default ListNotification

