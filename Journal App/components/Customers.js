import React from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { getWindowValues } from '../numeric.js';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';


var ip = null;
var pass = null;
var email = null;
var navigation = null;
const {height, rem, width} = getWindowValues()

export const Customers = (props) => {
	ip = props.state.ip
	pass = props.state.pass
	email = props.state.email
	navigation = useNavigation();
	return (makeList(props.state.displayCust))
}


const renderCust = ({ item }) => (
	   <TouchableOpacity 
	   		key={item.id}
        	touchSoundDisabled={true}
        	style={styles.customerItem}
   			onPress={ 
			() => navigation.navigate('Edit customer', { server: ip, items: item, email: email, password: pass })}>
            	<View style={{ flexDirection: "column", flex: 1, justifyContent: 'space-evenly' }}>
					<Text 	style={styles.name}>{item.full_name}</Text>
					<Text 	style={styles.address}
							onPress={() => Linking.openURL('https://maps.google.com/?q=' + item.address)}>
							{item.address}</Text>
					<Text 	style={styles.phone}
							onPress={() => Linking.openURL('tel:' + item.ph_num)}>
					{item.ph_num}</Text>
            </View>
        </TouchableOpacity>
        );


const makeList = (data) => {
		return (
			<View style={{flex: 1}}>
				<FlatList
	           		initialNumToRender={1}
	           		maxToRenderPerBatch={1}
	                data={data}
	                renderItem={renderCust}
	                showsVerticalScrollIndicator={false}>
			  	</FlatList>
			</View>
		  	);
}


const styles = StyleSheet.create({
    customerItem: {
		flex: 1,
		height: 150 * rem,
        backgroundColor: "white",
        paddingLeft: 20 * rem,
        paddingRight: 20 * rem,
        flexDirection: "row",
        marginVertical: 2 * rem
    },
    name: {
        fontSize: 25 * rem,
        fontWeight: 'bold'
    },
    address: {
		width: 150 * rem,
        fontSize: 20 * rem,
       	textDecorationLine: 'underline',
    },
    phone: {
		width: 150 * rem,
        fontSize: 20 * rem,
        textDecorationLine: 'underline',
    },
	
	
})