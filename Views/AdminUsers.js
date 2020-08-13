import React ,{useEffect,useState} from 'react';
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
import APIdata from '../Src/APIdata';
import Socket from '../Src/SocketListener';

const APIDeleteUsr = (_id) =>{
    fetch(APIdata.URI+'/deleteUsersData',{
        method:'PUT',
        body:JSON.stringify({_id:_id}),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(res=>res.json())
      .then(res=>{
        if(res.status === 22){
            alert('El usuario ha sido eliminado')
            EventEmmiter.emit('onUserDelete',true)
            Socket.emit('onUserDelete',_id)
            return 0
        } 
      })
      .catch(e=>{
          console.log('conection refused to server')
      })
}

const CardUserRender = (props) =>{
    return(
        <View
         style={styles.containerCard}
        >
            <Text
             style={styles.TextCard}
            >
                {props.name}
            </Text>
            <Text
             style={styles.TextCard}
            >
                {props.email}
            </Text>
            <Text
             style={styles.TextCard}
            >
                {props.roll}
            </Text>
            <TouchableOpacity
             style={styles.buttonEliminate}
             onPress = {()=>{
                 APIDeleteUsr(props.id)
             }}
            >
                <Image
                 source = {require('../Images/cerrarWhite.png')}
                 style = {{width:15,height:15}}
                />
            </TouchableOpacity>
        </View>
    )
}

const AdminUsers = () => {

    let [users,setUsers] = useState([])

    useEffect(()=>{
        
            
            const readUsers = async()=>{
               var resObj
               await fetch(APIdata.URI+'/getUsersData',{
                    method:'PUT',
                    body:JSON.stringify({status:'ok'}),
                    headers:{
                        'Content-Type':'application/json'
                    }
                }).then(res=>res.json())
                  .then(res=>{
                    resObj =  res.status
                  })
                  .catch(e=>{
                      console.log('conection refused to server')
                  })
                  setUsers(resObj)
                  console.log(resObj)
            }
        readUsers()

        EventEmmiter.on('onUserDelete',()=>{
            readUsers()
        })
        
    },[])
    return(
        <View
         style={styles.container}
        >
            <Header
             Title = {'Administrador usuarios'}
            />
            <View
             style={{width:'100%',alignItems:'center',justifyContent:'center',marginTop:20}}
            >
                <ScrollView
                 style = {{width:'100%',height:'90%'}}
                >
                 <View style={{alignItems:'center'}}>
                 {users.map((value)=>{
                     var defineRoll = ''
                     if(value.roll === '1'){
                       defineRoll = 'Administrador'    
                     }else if(value.roll === '2'){
                       defineRoll = 'Operario'    
                     }else if(value.roll === '3'){
                        defineRoll = 'Gerente'
                     }
                     return(
                         <CardUserRender
                          name = {value.name}
                          roll = {defineRoll}
                          email = {value.email}
                          id ={value._id}
                         />
                     )
                 })}
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
    },
    buttonEliminate:{
        position:'absolute',
        width:40,
        height:40,
        backgroundColor:'red',
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        top:5,
        right:5
    },
    containerCard:{
        width:'90%',
        backgroundColor:'white',
        marginVertical:5,
        borderRadius:15
    },
    TextCard:{
        marginHorizontal:10,
        marginVertical:5
    }
})

export default AdminUsers