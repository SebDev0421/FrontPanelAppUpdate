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

const dateNow = new Date()

const Terms = () => {
    return(
        <View
         style={styles.container}
        >
            <Header
             Title = {'Terminos'}
            />
            <View
             style={{width:'100%',alignItems:'center'}}
            >
                <View
                 style={{backgroundColor:'white',width:'90%',marginVertical:30,borderRadius:15,alignItems:'center'}}
                >
                <Text
                 style={{fontSize:25,fontWeight:'bold'}}
                >Termino y condiciones</Text>
                <Text
                 style={{marginHorizontal:20,marginVertical:20}}
                >
                    Al estar dentro de los servicios de esta app usted como usario y su actividad dentro
                    de la empresa front panel esta monitoreada.

                    Si tiene algun problema podra reportarlo en el servicio acerca de nosotros en el app.

                    Solo el cuerpo directivo de FRONT PANEL {dateNow.getFullYear()} tendra accesso a y manipulacion de los datos
                    para garantizar la seguridad de los datos de cada usuario.
                </Text>
                </View>
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
    }
})

export default Terms