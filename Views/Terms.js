import React from 'react';
import{
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Text,
    ScrollView
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
             Title = {'Términos'}
            />
            <View
             style={{width:'100%',alignItems:'center'}}
            >
            <ScrollView
             style={{backgroundColor:'white',width:'90%',height:'80%',marginVertical:30,borderRadius:15}}
            >
                <View
                 style={{alignItems:'center'}}
                >
                <Text
                 style={{fontSize:25,fontWeight:'bold'}}
                >Términos y condiciones</Text>
                <Text
                 style={{marginHorizontal:20,marginVertical:20}}
                >
                    INFORMACIÓN GENERAL

                   Este sitio web es operado por Front Panel. En todo el sitio, los términos “nosotros”, “nos” y “nuestro” se refieren a 
                   Front Panel. Front Panel ofrece este sitio web, incluyendo toda la información, herramientas y servicios disponibles 
                   para ti en este sitio, el usuario, está condicionado a la aceptación de todos los términos, condiciones, políticas 
                   y notificaciones aquí establecidos.{"\n"}

                   - La aplicación no solicita ni precisa de acceso a ningún dato ni aplicación del terminal.{"\n"}
                   - Toda la información transmitida por esta aplicación es de uso exclusivo para los miembros aceptados quedando prohibida toda información y exhibición de las tareas que circulen por la misma a personas ajenas a la empresa. El incumplimiento de estas normas se someterá a las leyes de confidencialidad en el ámbito de la industria.{"\n"}
                   - La confidencialidad se mantendrá incluso después de que un miembro deje de formar parte del grupo aceptado en la aplicación o deje de firmar parte de la empresa, quedando expuesto a las leyes que rigen en defensa de dicha confidencialidad en el ámbito de la industria.{"\n"}

                    Al estar dentro de los servicios de esta app usted como usuario y su actividad dentro
                    de la empresa front panel esta monitoreada.{"\n"}

                    Si tiene algun problema podra reportarlo en el servicio acerca de nosotros en el app.{"\n"}

                    Solo el cuerpo directivo de FRONT PANEL {dateNow.getFullYear()} tendra acceso a y manipulacion de los datos
                    para garantizar la seguridad de los datos de cada usuario.
                </Text>
                </View>
                </ScrollView>
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