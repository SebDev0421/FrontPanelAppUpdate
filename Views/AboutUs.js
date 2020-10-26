import React ,{useEffect,useState}from 'react';
import{
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Text,
    BackHandler
} from 'react-native';

import EventEmmiter from 'react-native-eventemitter';
import Header from './Header';
import SendSugerence from './SendSugerence';

const AboutUs = () => {
    let [viewAdvice, setViewAdvice] = useState()
    useEffect(()=>{
        EventEmmiter.on('onCloseTextInputSugerence',()=>{
            setViewAdvice()
        })
        const backAction = () => {
            EventEmmiter.emit('onCloseSetting',true)
            return true;
        }
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        )
    
        return () => backHandler.remove();
    },[])
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
             onPress = {()=>{
                 setViewAdvice(<SendSugerence/>)
             }}
            >
                <Text
                 style={styles.TextBtn}
                >
                    Tienes alguna sugerencia?
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
            {viewAdvice}
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