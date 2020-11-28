import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';


const d = Dimensions.get("window")
const is7 = Platform.OS === "ios" && (d.height > 600) ? true : false

const Header = (props) => { 
    return(
        <View
         style={styles.container}
        >
            <Text style={[styles.TextTitle,is7 ? {fontSize: 17} : {fontSize:20}]}>{props.Title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:60,
        backgroundColor:'#0564B3',
        borderBottomEndRadius:40,
        borderBottomStartRadius:40,
        alignItems:'center',
        justifyContent:'center'
    },
    TextTitle:{
        color:'white',
        fontWeight:'bold'
    }
})

export default Header;