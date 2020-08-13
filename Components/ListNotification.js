import React from 'react';
import{
    View,
    Text,
    ScrollView,
    StyleSheet,
} from 'react-native';

const DataDeploy = () => {
    return(
        <View
         style = {styles.cardNotifications}
        >
            <Text
             style = {styles.TitleNot}
            >Orden creada</Text>
            <View
             style = {styles.body}
            >
              <Text>Se ha creado la orden 1578</Text>
            </View>
        </View>
    )
}

const ListNotification = () => {
    return(
        <View
         style = {styles.container}
        >
            <ScrollView
             style = {styles.ScrollSet}
            >
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
                <DataDeploy/>
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

