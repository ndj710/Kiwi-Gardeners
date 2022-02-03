import React from 'react';
import { StyleSheet, Text, Button, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { isAlphaNumeric, isNumeric, convertTime, isMoney } from '../numeric.js';
import SearchableDropdown from 'react-native-searchable-dropdown';

export default class EditData extends React.Component {
	time = convertTime(this.props.route.params.items.est_time);
	constructor(props) {
		super(props)
		this.state = {
			id: this.props.route.params.items.id,
			job_desc: this.props.route.params.items.job_desc,
			full_name: this.props.route.params.items.full_name,
			job_address: this.props.route.params.items.job_address,
			ph_num: this.props.route.params.items.ph_num,
			hours: this.time.hours,
			minutes: this.time.minutes,
			quote: this.props.route.params.items.quote,
			pass: this.props.route.params.password,
			status: this.props.route.params.items.job_status,
			comments: this.props.route.params.items.comments,
			bcolours: ['black', 'black', 'black', 'black', 'black', 'black'],
			ip: this.props.route.params.server,
			selectedItems: [{id: 0, name: 'Ongoing'}],
			items: [{id: 0, name: 'Ongoing'},
					{id: 1, name: 'Complete'}],
			button: false

		}
	}

	callBackend = async () => {
		let checkform = [!isAlphaNumeric(this.state.job_desc, false), !isAlphaNumeric(this.state.job_address, false), !isNumeric(this.state.hours), !isNumeric(this.state.minutes), !isMoney(this.state.quote), !isAlphaNumeric(this.state.comments)]
		
		let newColours = []
		checkform.forEach(async (element) => {
			if (element == false) {
				newColours.push('black')
			} else {
				newColours.push('red')
			}
		})
		await this.setState({bcolours: newColours})
		
		if (this.state.bcolours.every((element) => {return(element == 'black')})) {
			let est_time = 0
			est_time = est_time + parseInt(this.state.hours)*60 || est_time + 0
			est_time = est_time + + parseInt(this.state.minutes) || est_time + 0
			if (est_time == 0){
				est_time = null
			}
			this.setState({button:true})
			let payload = [ this.state.pass, this.state.job_desc, this.state.full_name,
												this.state.job_address, this.state.ph_num,
												est_time, this.state.quote, this.state.status, this.state.comments, this.state.id ]
			let data = JSON.stringify(payload)
			try {
				var response = await axios.post(this.state.ip + "EditJob", data)
				if (response.data == 'Done') {
					this.props.navigation.navigate( 'Data', {server: this.state.ip, pass: this.state.pass});
				} else {
					alert('Something broke')
					this.setState({button:false})
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			alert('Imports wrong types')
		}
	};
	
	deleteJob = async () => {
			let payload = [ this.state.pass, this.state.id ]
			let data = JSON.stringify(payload)
			try {
				var response = await axios.post(this.state.ip + "DeleteJob", data)
				if (response.data == 'Done') {
					this.props.navigation.navigate( 'Data', {server: this.state.ip, pass: this.state.pass});
				} else {
					alert('Something broke')
					this.setState({button:false})
				}
			} catch (error) {
				console.log(error);
			}
	}
	createTwoButtonAlert = () =>
    Alert.alert(
      "Delete Job",
      "Are you sure you want to delete this job?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Delete", onPress: this.deleteJob }
      ]
    );
	
	componentDidMount() {
		if(this.state.hours == 'NA') {
			this.setState({hours: '', minutes: ''})
		}
		if (this.state.quote == 'NA') {
			this.setState({quote: ''})			
		}		
	}
	
  	render() {

        	return (

				<View style={styles(this.state).container}>
					<View style={styles(this.state).buttonCont}>
					<TouchableOpacity 
						style={styles(this.state).button}
			        	onPress={this.createTwoButtonAlert}
			        	activeOpacity={0.4}>
			        	<Text>Delete</Text>
			      	</TouchableOpacity>
			      	</View>
					<Text style={styles(this.state).headers}>Job description *</Text>
			 		<TextInput
			        style={styles(this.state).job_input}
			        defaultValue={this.props.route.params.items.job_desc}
			        onChangeText={(e) => this.setState({ job_desc: e})}
			      	/>
					<Text style={styles(this.state).headers}>Job Address *</Text>
					<TextInput
			        style={styles(this.state).address_input}
			        defaultValue={this.props.route.params.items.job_address}
			        onChangeText={(e) => this.setState({ job_address: e})}
			      	/>
			      	<Text style={styles(this.state).headers}>Estimated time</Text>
			      	<View style={{ flexDirection: 'row'}}>
						<TextInput
				        style={styles(this.state).hour_input}
				        defaultValue={this.state.hours.toString()}
				        onChangeText={(e) => this.setState({ hours: e})}
				      	/>
				      	<Text style={styles(this.state).time}>hour(s)</Text>
						<TextInput
				        style={styles(this.state).minute_input}
				        defaultValue={this.state.minutes.toString()}
				        onChangeText={(e) => this.setState({ minutes: e})}
				      	/>
				      	<Text style={styles(this.state).time}>minutes</Text>
			      	</View>
			      	<Text style={styles(this.state).headers}>Quote (dollars)</Text>
					<TextInput
			        style={styles(this.state).quote_input}
			        defaultValue={this.state.quote}
			        onChangeText={(e) => this.setState({ quote: e})}
			      	/>
			      	<Text style={styles(this.state).headers}>Status</Text>
		          	<SearchableDropdown
			            onItemSelect={(item) => {
			              this.setState({ status: item.name });
			            }}
			            containerStyle={{ padding: 5 }}
			            itemStyle={{
			              padding: 10,
			              marginTop: 2,
			              backgroundColor: '#ddd',
			              borderColor: '#bbb',
			              borderWidth: 1,
			              borderRadius: 5,
			            }}
			            itemTextStyle={{ color: '#222' }}
			            itemsContainerStyle={{ maxHeight: 140 }}
			            items={this.state.items}
			            defaultIndex={2}
			            resetValue={false}
			            textInputProps={
			              {
							defaultValue: this.state.status,
							value: this.state.selectedItems.name,
			                placeholder: "Status",
			                style: {
								backgroundColor: 'white',
							    height: 40,
							    margin: 12,
							    borderWidth: 2,
	    						borderColor: Object.values(this.state.bcolours)[6],
							    padding: 10,
			                },
			              }
			            }
			            listProps={
			              {
			                nestedScrollEnabled: true,
			              }
			            }
			        />
			       	<Text style={styles(this.state).headers}>Comments</Text>
					<TextInput
			        style={styles(this.state).comments_input}
			        defaultValue={this.props.route.params.items.comments}
			        onChangeText={(e) => this.setState({ comments: e})}
			      	/>
					<View style={styles(this.state).cust}>
				      	<Text style={styles(this.state).headers}>Customer: {this.state.full_name}</Text>
	
				      	<Text style={styles(this.state).headers}>Phone: {this.state.ph_num}</Text>
				    </View>
			        
			      	<Button disabled={this.state.button}
			        onPress={this.callBackend}
			        style={styles(this.state).confirm, { backgroundColor: 'blue' }}
			        title='Confirm'>
			      	</Button>
				</View>
			)			
 
  	}
}

const styles = (state) => StyleSheet.create({
	buttonCont: {
		flexDirection: 'row',

    	justifyContent: "flex-end",

	},
	button: {
		backgroundColor: 'pink',
		padding: 20,
		flex: 0.2,
		flexDirection: 'row',
		borderWidth: 1
	},
	time: {
		paddingTop: 20,
		textAlign: "center",
    	justifyContent: "center",
    	fontSize: 15
	},
	cust: {
		paddingBottom: 10
	},
	container: {
		flex: 1,
		padding: 50,
		backgroundColor: '#EBECF4',
		textAlign: "center",
    	justifyContent: "center"
	},
	headers:{
		textAlign: "center",
    	justifyContent: "center",
    	fontSize: 15
	},
	input: {
		backgroundColor: 'white',
	    height: 40,
	    margin: 12,
	    borderWidth: 1,
	    padding: 10,
	},
	confirm: {
		paddingTop: 50
	},
	job_input: {
		backgroundColor: 'white',
	    height: 40,
	    margin: 12,
	    borderWidth: 2,
	    borderColor: Object.values(state.bcolours)[0],
	    padding: 10,		
	},
	address_input: {
		backgroundColor: 'white',
	    height: 40,
	    margin: 12,
	    borderWidth: 2,
	    borderColor: Object.values(state.bcolours)[1],
	    padding: 10,		
	},
	hour_input: {
		backgroundColor: 'white',
	    height: 40,
	    margin: 12,
	    flex: 0.5,
	    borderWidth: 2,
	    borderColor: Object.values(state.bcolours)[2],
	    padding: 10,		
	},
	minute_input: {
		backgroundColor: 'white',
	    height: 40,
	    margin: 12,
	   	flex: 0.5,
	    borderWidth: 2,
	    borderColor: Object.values(state.bcolours)[3],
	    padding: 10,		
	},
	quote_input: {
		backgroundColor: 'white',
	    height: 40,
	    margin: 12,
	    borderWidth: 2,
	    borderColor: Object.values(state.bcolours)[4],
	    padding: 10,		
	},
	comments_input: {
		backgroundColor: 'white',
	    height: 40,
	    margin: 12,
	    borderWidth: 2,
	    borderColor: Object.values(state.bcolours)[5],
	    padding: 10,		
	},
});

