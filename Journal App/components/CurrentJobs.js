import React from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { getWindowValues } from '../numeric.js';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';

var ip = null;
var pass = null;
var email = null;
var navigation = null;
var account = null;
var emp_data = null;
var on_job = null;

export const CurrentJobs = (props) => {
	ip = props.state.ip
	pass = props.state.pass
	email = props.state.email
	account = props.state.account
	emp_data = props.state.empData
	on_job = props.state.onJobData
	navigation = useNavigation();
	return (makeList(props.state.displayCur))
}


const renderJob = ({ item }) => {
	let employees = []
	on_job.forEach(element => {
		if (element.job_id == item.id) {
			if (employees.length != 0) {
			employees.push(', ' + element.full_name)
			} else {
				employees.push(element.full_name)
			}
		}
	})
	return(
        <TouchableOpacity 
        	key={item.id}
        	touchSoundDisabled={true}
        	style={styles.jobItem}
   			onPress={ 
			() => navigation.navigate('Edit job', { employees: employees, emp_data: emp_data, account: account, server: ip, items: item, email: email, password: pass })}>
         		<View style={{ flexDirection: "row"}}>
            	    <Text style={styles.job_header_desc}>{item.job_desc}</Text>
            	    <Text style={styles.job_header_status}>{item.job_status}</Text>
            	 </View>
            	<View style={{flexDirection: "row", flex: 1, justifyContent: 'space-evenly'  }}>
                	<View style={styles.sections}>
						<Text style={styles.name}>{item.full_name}</Text>
	 					<Text 	style={styles.custaddress}
	 							onPress={() => Linking.openURL('https://maps.google.com/?q=' + item.cust_address)}>
	 							{item.cust_address}</Text>
						<Text 	style={styles.phone}
								onPress={() => Linking.openURL('tel:' + item.ph_num)}>
								{item.ph_num}</Text>
                	</View>
                	<View style={styles.sections}>
	 					<Text 	style={styles.jobaddress}
								onPress={() => Linking.openURL('https://maps.google.com/?q=' + item.job_address)}>	 					
	 							{item.job_address}</Text>
						<Text style={styles.time}>{item.time.hours} hrs {item.time.minutes} mins</Text>
						<Text style={styles.quote}>${item.quote}</Text>	

                    </View>                        	
                	<View style={styles.sections}>
            	    	<Text style={styles.comments}>{item.comments}</Text>
					</View>
                </View>
                {employees.length != 0 && <Text>Employees: {employees}</Text>}
        </TouchableOpacity>
)
}



const makeList = (data) => {
		return (
			<View style={{flex: 1}}>
				<FlatList
	           		initialNumToRender={1}
	           		maxToRenderPerBatch={1}
	                data={data}
	                renderItem={renderJob}
	                showsVerticalScrollIndicator={false}>
			  	</FlatList>
			</View>
		  	);
}

const {height, rem, width} = getWindowValues()
const styles = StyleSheet.create({
	jobItem: {
		flex: 1,
        backgroundColor: "white",
        paddingLeft: 20 * rem,
        paddingRight: 20 * rem,
        flexDirection: "column",
        marginVertical: 2 * rem
    },
	job_header_desc: {	
		flex: 0.8,
        fontSize: 24 * rem,
        fontWeight: 'bold'

	},
	job_header_status: {	
		flex: 0.2,
        fontSize: 24 * rem,
        fontWeight: 'bold'
	},
	sections: {
		paddingTop: 20 * rem,
		flexDirection: "column",
		flex: 0.33333,
        paddingBottom: 3 * rem,
	},
    name: {
        fontSize: 23 * rem,
        fontWeight: 'bold'
    },
    custaddress: {
		width: 150 * rem,
        fontSize: 18 * rem,
       	textDecorationLine: 'underline',
    },
    phone: {
		width: 150 * rem,
        fontSize: 18 * rem,
        textDecorationLine: 'underline',
    },
	
    time: {
		paddingLeft: 3 * rem,
        fontSize: 18 * rem,
    },
    quote: {
		paddingLeft: 3 * rem,
        fontSize: 18 * rem,
    },
    jobaddress: {
		width: 150 * rem,
        fontSize: 18 * rem,
       	textDecorationLine: 'underline',
    },
    comments: {
		paddingLeft: 3 * rem,
        fontSize: 18 * rem,
    },
   
	
	
})