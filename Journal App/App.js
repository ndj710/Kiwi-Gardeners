import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/Login';
import EditJobData from './components/EditJobData';
import Data from './components/Data';
import EmpData from './components/EmpData';
import EditCustomer from './components/EditCustomer';
import NewJob from './components/NewJob';
import NewCust from './components/NewCustomer';
import ResetPassword from './components/ResetPassword'


const Stack = createNativeStackNavigator();


export default function App() {
	  	return (
		    <NavigationContainer>
		      <Stack.Navigator>
		        <Stack.Screen name='Login' component={Login} options={{
					headerBackVisible: false, title: '', headerShown: false
				}}/>
        		<Stack.Screen name='Data' component={Data} options={{
					headerBackVisible: false, title: '', headerShown: false
				}}/>
        		<Stack.Screen name='Emp Data' component={EmpData} options={{
					headerBackVisible: false, title: '', headerShown: false
				}}/>
		       	<Stack.Screen name='Edit job' component={EditJobData}/>
		   		<Stack.Screen name='Edit customer' component={EditCustomer}/>
		   		<Stack.Screen name='New Job' component={NewJob}/>
		   		<Stack.Screen name='New Customer' component={NewCust}/>
		   		<Stack.Screen name='Reset Password' component={ResetPassword}/>
		      </Stack.Navigator>
		    </NavigationContainer>
  		);	
}
