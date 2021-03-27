import { StatusBar } from 'expo-status-bar';
import React,{useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Amplify from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react-native'
import config from './src/aws-exports'
import {
  Auth ,
  API,
  graphqlOperation,

} from 'aws-amplify';
import {getUser} from "./src/graphql/queries"
import {createUser} from "./src/graphql/mutations"
Amplify.configure(config)


const randomImages = [
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-2.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-3.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-6.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-9.jpg',
]

const App = () => {

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const getRandomImage = () => {
    return randomImages[Math.floor(Math.random() * randomImages.length)];
  }

  useEffect(() => {
    const fetchUser = async () => {
      //get Authenticator used from Auth
        const userInfo = await Auth.currentAuthenticatedUser({bypassCache:true});

        if(userInfo){
      //get User from Backend with user SUB
          const userData = await API.graphql(
            graphqlOperation(getUser,{id: userInfo.attributes.sub}))
            if(userData.data.getUser){
              console.log('User is already registered in database');
              return;
        }
        const newUser = {
          id:userInfo.attributes.sub,
          name:userInfo.username,
          imageUri: getRandomImage(),
          status:"hey o am using whatsapp",
        }

        await API.graphql(
          graphqlOperation(
            createUser,{input:newUser}
          )
        )
    }
   
    }


    fetchUser();
  },[])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App)