import React,{useEffect,useState} from 'react';
import{
    View,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Text,
    ScrollView,
    Image,
    AsyncStorage,
    BackHandler
} from 'react-native';

import APIdata from '../Src/APIdata';
import EventEmmiter from 'react-native-eventemitter';
import Header from './Header';
var getUser = {}

const changeLocalData = async(data)=>{
    try{
        await AsyncStorage.setItem('credentialsAPPfront',JSON.stringify(data));

     }catch(e){
         console.log(e)
     }
}


const APIChangeUserData = (find,name,lastName,email,number,id) => {
    fetch(APIdata.URI+'/changeData',{
        method:'PUT',
        body:JSON.stringify({_id:find,name:name,lastName:lastName,email:email,phone:number,idEmployed:id}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res=>res.json())
      .then(res=>{
          console.log(res.status)
          if(res.status !== 95){
            alert('Sus datos fueron cambiados con exito')
            console.log(res.status)
            changeLocalData(res.status)
            EventEmmiter.emit('onCloseSetting',true)
            
            return 0
          }else{
              alert('Error con esta operacion')
          }
      })
}


const Setting = (props) => {
      let  [name, setName] = useState(''),
        [lastName, setLastName] = useState(''),
        [email, setEmail] = useState(''),
        [number, setNumber] = useState(''),
        [id, setId] = useState(''),
        [enableEdit,setEneableChange] = useState(false)
    useEffect(()=>{
        var getUser

        const dataUser = async()=>{
            const data = await AsyncStorage.getItem('credentialsAPPfront')
            console.log(data)
            getUser = JSON.parse(data)
            fetch(APIdata.URI+'/consult',{
                method:'PUT',
                body:JSON.stringify({_id:getUser._id}),
                headers:{
                    'Content-Type':'application/json'
                }
            }).then(res => res.json())
              .then((res)=>{
                if(res.status === 95){
                    alert('Este usuario ya no existe contacte con el gerente')
                    return 0
                }
                const getUserData = res.status
                setName(getUserData.name)
                setLastName(getUserData.lastName)
                setEmail(getUserData.email)
                setNumber(getUserData.phone)
                setId(getUserData.idEmployed)
              }).
              catch((e)=>{
                  alert('Error en la connexion')
                  if(e) throw e
              })
            
        }

        dataUser()

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
         style={
             styles.container
         }
        >
            <Header
             Title = {'Configuración'}
            />
             <ScrollView
              style={{width:'100%',height:'100%'}}
             >
             <View style={{width:'100%',alignItems:'center',height:'100%'}}>
                <View style = {styles.UserConfigContainer}>
                    <View style={{alignItems:'center'}}>
                    <Text
                     style={styles.TextTitle}
                    >Nombres</Text>
                    <TextInput
                      style = {styles.TextInput}
                      placeholder = {'Nombre'}
                      value= {name}
                      onChangeText = {(value)=>{
                          setName(value)
                      }}
                    />
                    <Text
                     style={styles.TextTitle}
                    >Apellidos</Text>
                    <TextInput
                      style = {styles.TextInput}
                      placeholder = {'Apellido'}
                      value = {lastName}
                      onChangeText = {(value)=>{
                        setLastName(value)
                    }}
                    />
                    <Text
                     style={styles.TextTitle}
                    >Correo</Text>
                    <TextInput
                      style = {styles.TextInput}
                      placeholder = {'Correo electronico'}
                      value = {email}
                      onChangeText = {(value)=>{
                        setEmail(value)
                    }}
                    />
                    <Text
                     style={styles.TextTitle}
                    >Número telefónico</Text>
                    <TextInput
                      style = {styles.TextInput}
                      placeholder = {'Telefono'}
                      value = {number}
                      keyboardType={'number-pad'}
                      onChangeText = {(value)=>{
                        setNumber(value)
                    }}
                    />
                    <Text
                     style={styles.TextTitle}
                    >Id</Text>
                    <TextInput
                      style = {styles.TextInput}
                      placeholder = {'Id'}
                      value = {id}
                      onChangeText = {(value)=>{
                        setId(value)
                    }}
                    />
                    </View>
                    <View
                     style={styles.containerBtns}
                    >
                    <TouchableOpacity
                    onPress = {()=>{
                        APIChangeUserData(props.dataUser._id,name,lastName,email,number,id)
                        //console.log(props.dataUser._id)
                    }}
                    style={[styles.BtnsSetting,{backgroundColor:'#49BB3C'}]}>
                        <Text
                         style={styles.TextBtns}
                        >
                            Guardar Cambios
                        </Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </View>
                </ScrollView>
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
    UserConfigContainer:{
        backgroundColor:'white',
        width:'90%',
        marginVertical:15,
        borderRadius:20
    },
    BtnsSetting:{
        height:50,
        width:'80%',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:15,
        marginVertical:10
    },
    containerBtns:{
        width:'100%',
        alignItems:'center'
    },
    TextBtns:{
        color:'white',
        fontWeight:'bold'
    },
    TextInput:{
        height:50,
        width:'85%',
        borderWidth:1,
        borderColor:'gray',
        borderRadius:10,
        marginVertical:5
    },
    TextTitle:{
        marginTop:5,
    },
    btnBack:{
        position:'absolute',
        left:10,
        top:10
    }
})

export default Setting