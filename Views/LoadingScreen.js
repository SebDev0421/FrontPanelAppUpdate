import React from 'react'
import{
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native'

const LoadingScreen = ()=>{
    return(
        <View
         style = {styles.container}
        >
            <Image source = {require('../Images/frontPanel.png')} style={{width:200,height:100}}/>

            <View
             style = {styles.TextBottom}
            >
                <Text>Powered by FRONT PANEL</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        top:0,
        left:0,
        backgroundColor:'white',
        width:'100%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center'
    },
    TextBottom:{
        position:'absolute',
        bottom:20
    }
})

export default LoadingScreen;