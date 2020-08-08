import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

const Header = (props) => { 
    return(
        <View
         style={styles.container}
        >
            <Text style={styles.TextTitle}>{props.Title}</Text>
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
        fontSize:20,
        fontWeight:'bold'
    }
})

export default Header;