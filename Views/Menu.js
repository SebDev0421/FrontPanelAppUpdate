import React, {useEffect,useState} from 'react';
import{
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    ScrollView,
    Image,
    AsyncStorage,
    Alert
} from 'react-native';

import Header from './Header';
import Setting from './Setting';
import AboutUs from './AboutUs';
import Terms from './Terms';

import EventEmitter from 'react-native-eventemitter';
import AdminUsers from './AdminUsers';

const animation = new Animated.Value(Dimensions.get('window').width);
let move = 0

const swipeEffect = () => {
    Animated.timing(
        animation,
        {
            toValue:move,
            duration:400,
            useNativeDriver:false
        }
    ).start()
}

const logout = async()=>{
    try{
        await AsyncStorage.setItem('credentialsAPPfront','');
        EventEmitter.emit('closeService',true)

     }catch(e){
         console.log(e)
     }
}

const Menu = (props)=>{
    let [roll,setRoll] = useState('')
    let [initials,setInitials] = useState('')
    let [viewOpenMenu,setViewOpenMenu] = useState()
    let [btnAdmin, setBtnAdmin] = useState()
    let [king,setKing] = useState()
    useEffect(()=>{
        move = 0
       swipeEffect()
       if(props.userCred.roll === '1'){
           setRoll('Ordenante')
           setBtnAdmin()
       }else if(props.userCred.roll === '2'){
           setRoll('Operario')
           setBtnAdmin()
       }else{
        setRoll('Gerencia')
        setKing(<Image
            source = {require('../Images/corona.png')}
            style = {{width:40,height:40}}
           />)
        setBtnAdmin(<TouchableOpacity
            onPress = {() => {
                   setViewOpenMenu(<AdminUsers/>)
            }}
            style = {[styles.Item,{
               borderBottomWidth:1,
               borderBottomColor:'gray'}]}
           >
               <Text style={styles.TextItem}>Administrar</Text>
           </TouchableOpacity>)
       }
       var name = props.userCred.name
       var lastName = props.userCred.lastName
       try{
        name = name.substring(0,1)
       }catch(e){
           name = ''
           console.log(e)
       }
       try{
        lastName = lastName.substring(0,1)
       }catch(e){
           lastName = ''
           console.log(e)
       }
       const defInitials =name.toUpperCase()+lastName.toUpperCase()
       setInitials(defInitials)
       
       EventEmitter.on('onCloseSetting',()=>{
           setViewOpenMenu()
       }) 

    },[])
    return(
        <Animated.View
         style = {[styles.container,{
            right:animation
        }]}
        >
            <Header
             Title = "Menu"
            />
            <ScrollView style={styles.ScrollSetting}>
            <View style={styles.containerOptions}>
                    <View style = {styles.UserData}>
                        <View
                         style = {{marginVertical:15,marginHorizontal:15,alignItems:'center',justifyContent:'center'}}
                        >
                            
                            <Image source= {require('../Images/wallUser.jpg')} style={{width:70,height:70,borderRadius:70/2}}/>
                            <Text
                             style={{position:'absolute',color:'white',fontSize:20}}
                            >{initials}</Text>
                        </View>
                        <View>
                            <Text>{props.userCred.name} {props.userCred.lastName}</Text>
                            <Text>Front panel</Text>
                            <Text>{props.userCred.email}</Text>
                            <View
                             style = {{flexDirection:'row',alignItems:'center'}}
                            >
                            <Text>{roll}</Text>
                            {king}
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.containerOptions}>
                    <View style = {styles.Options}>
                        {btnAdmin}
                        <TouchableOpacity
                         onPress = {() => {
                                setViewOpenMenu(<Setting
                                 dataUser = {props.userCred}
                                 CompareObj = {props.userCred}
                                />)
                         }}
                         style = {[styles.Item,{
                            borderBottomWidth:1,
                            borderBottomColor:'gray'}]}
                        >
                            <Text style={styles.TextItem}>Configuracion</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress = {() => {
                            setViewOpenMenu(<AboutUs/>)
                         }}
                         style = {[styles.Item,{
                            borderBottomWidth:1,
                            borderBottomColor:'gray'}]}
                        >
                            <Text style={styles.TextItem}>Acerca de nosotros</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                         onPress = {() => {
                            setViewOpenMenu(<Terms/>)
                     }}
                         style = {[styles.Item,{
                            borderBottomWidth:1,
                            borderBottomColor:'gray'}]}
                        >
                            <Text style={styles.TextItem}>Terminos y condiciones</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                         style = {styles.Item}
                         onPress = {()=>{    
                             Alert.alert('Salir de FRONT PANEL App','Quieres salir?',[{
                                 text:'No'
                             },
                             {
                                 text:'Si',
                                 onPress: ()=>{
                                     logout()
                                 }
                             }
                            ])
                         }}
                        >
                            <Text style={styles.TextItem}>Cerrar sesion</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.btnClose}
              onPress = {()=>{
                  move = Dimensions.get('window').width
                  swipeEffect()
                  
                   EventEmitter.emit('onCloseMenu',true)
              }}
            >
                <Image source = {require('../Images/arrowright.png')} style={{width:25,height:25}}/>
            </TouchableOpacity>
            {viewOpenMenu}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        width:'100%',
        height:'100%',
        top:0,
        backgroundColor:'#E3E3E3'
    },
    ScrollSetting:{
        width:'100%',
        height:'100%'
    },
    containerOptions:{
        width:'100%',
        alignItems:"center",
        marginVertical:20
    },
    Options:{
        width:'90%',
        backgroundColor:'white',
        borderRadius:15
    },
    btnClose:{
        position:'absolute',
        right:10,
        top:15
    },
    Item:{
        width:'100%',
        height:50,
        justifyContent:'center'
    },
    TextItem:{
        color:'gray',
        fontSize:17,
        marginHorizontal:10,
        marginVertical:10
    },
    UserData:{
        width:'90%',
        backgroundColor:'white',
        borderRadius:15,
        flexDirection:'row',
        alignItems:'center'
    },


})

export default Menu