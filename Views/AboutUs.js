import React from 'react';
import{
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Text
} from 'react-native';

import EventEmmiter from 'react-native-eventemitter';
import Header from './Header';

const AboutUs = () => {
    return(
        <View
         style={styles.container}
        >
            <Header
             Title = {'Acerca de nosotros'}
            />
            <View
             style={{width:'100%',alignItems:'center'}}
            >
            <Image
                 source={require('../Images/frontPanel.png')}
                 style={{width:200,height:100,marginVertical:35}}
                />
            <Text>FRONT PANEL APP v1.0.0</Text>
            <TouchableOpacity
             style={styles.btnRecome}
            >
                <Text
                 style={styles.TextBtn}
                >
                    Tienes Alguna sugerencia?
                </Text>
            </TouchableOpacity>
            </View>
             <TouchableOpacity
                 style={styles.btnBack}
                 onPress={()=>{
                     EventEmmiter.emit('onCloseSetting',true)
                 }}
                >
                    <Image source={require('../Images/arrowleft.png')}
                           style={{width:35,height:35}}
                    />
                </TouchableOpacity>
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
        backgroundColor:'#E3E3E3'
    },
    btnBack:{
        position:'absolute',
        left:10,
        top:10
    },
    btnRecome:{
        height:50,
        borderRadius:15,
        width:'80%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#0564B3',
        marginVertical:15
    },
    TextBtn:{
        color:'white'
    }
})

export default AboutUs