import React from 'react';
import{
    View,
    TouchableOpacity,
    Animated,
    Image
}from 'react-native';



const BtnExpandCard = (props) => {
    return(
        <View>
            
            <Animated.View
             style={props.rotate}
            >
                <Image source = {require('../Images/arrowdown.png')} style={{width:30,height:30}}/>
            </Animated.View>
        </View>
    )
}

export default BtnExpandCard;