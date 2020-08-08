/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React , {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  YellowBox,
  LogBox,
  AsyncStorage
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen'; 

import EventEmitter from 'react-native-eventemitter';


import Login from './Views/Login';
import Register from './Views/Register';
import Entry from './Views/Entry';
import TaskService from './Views/TaskService';
import LoadingScreen from './Views/LoadingScreen';

LogBox.ignoreAllLogs(true)

const App: () => React$Node = () => {
  let [taskService, setTaskService] = useState()
  let [viewLogin,setViewLogin] = useState()
  let [viewRegister,setViewRegister] = useState()
  let [viewEntry,setViewEntry] = useState(<LoadingScreen/>)
  useEffect(()=>{

    setTimeout( async()=>{
      const userCredentials = await AsyncStorage.getItem('credentialsAPPfront')
      if( userCredentials === null ){
        setViewEntry(<Entry/>)
      }else{
        setViewEntry()
        setTaskService(<TaskService/>)
      }
    },2000)

    EventEmitter.on('onCloseRegister',()=>{
      setViewRegister()
      setViewEntry()
      setViewLogin(<Login/>)  
    })

    EventEmitter.on('onOpenRegister',()=>{
      setViewLogin()
      setViewEntry()
      setViewRegister(<Register/>)
    })

    EventEmitter.on('openService',()=>{
      setViewLogin()
      setTaskService(<TaskService/>)
    })
    EventEmitter.on('closeService',()=>{
      setTaskService()
      setViewLogin(<Login/>)
    })
  },[])
  return (
    <>
      <SafeAreaView
       style={{width:'100%',height:'100%'}}
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
            {viewLogin}
            {viewRegister}
        </ScrollView>
        {viewEntry}
        {taskService}
      </SafeAreaView>
      
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
   width:'100%',
   height:'100%'
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
      },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
