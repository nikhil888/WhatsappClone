import React,{useState,useEffect} from 'react'
import {View,TextInput,TouchableOpacity} from 'react-native';
import styles from "./styles"
import {
    Fontisto,
    Octicons,
    MaterialCommunityIcons,
    MaterialIcons,
    FontAwesome5,
    Entypo
  } from '@expo/vector-icons';
import {API,graphqlOperation,Auth} from "aws-amplify"
import {createMessage} from "../../src/graphql/mutations"

const InputBox = (props) => {
  const {chatRoomID} = props;
    const [message,setMessage] = useState('')
    const [myuserId,setmyUserId] = useState(null);

    useEffect(() => {
      const fetchUser = async () => {
        const userInfo = await Auth.currentAuthenticatedUser();
          setmyUserId(userInfo.attributes.sub)
      }
      fetchUser();
    })

   
    
    const onMicroPhonePress = () => {
        console.warn("Microphone")
    }

    const onSendPress = async () => {
      try{
          await API.graphql(
            graphqlOperation(
              createMessage,{
                input:{
                  content:message,
                  userID:myuserId,
                  chatRoomID
                }
              }
            )
          )
      }catch(e){

      }
    }

    const onPress = () => {
        if(!message){
            onMicroPhonePress();
        }else{
            onSendPress();
        }
    }
    return (
        <View style={styles.container}>
        <View style={styles.mainContainer}>
          <FontAwesome5 name="laugh-beam" size={24} color="grey" />
          <TextInput
            placeholder={"Type a message"}
            style={styles.textInput}
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <Entypo name="attachment" size={24} color="grey" style={styles.icon} />
          {!message && <Fontisto name="camera" size={24} color="grey" style={styles.icon} />}
        </View>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.buttonContainer}>
            {!message
              ? <MaterialCommunityIcons name="microphone" size={28} color="white" />
              : <MaterialIcons name="send" size={28} color="white" />}
          </View>
        </TouchableOpacity>
        </View>
    )
}

export default InputBox
