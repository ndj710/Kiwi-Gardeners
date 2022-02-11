import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { isAlphaNumeric, isNumeric, convertTime, isMoney, getWindowValues } from '../numeric.js';
import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from 'react-native-vector-icons/FontAwesome';



const {height, rem, width} = getWindowValues()

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
			email: this.props.route.params.email,
			status: this.props.route.params.items.job_status,
			comments: this.props.route.params.items.comments,
			bcolours: ['black', 'black', 'black', 'black', 'black', 'black'],
			ip: this.props.route.params.server,
			account: this.props.route.params.account,
			selectedItems:  ['Ongoing'],
			items: ['Ongoing', 'Complete'],
			button: false, editable: false

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
			let payload = { email: this.state.email, pass: this.state.pass, job_desc: this.state.job_desc, full_name: this.state.full_name,
												job_address: this.state.job_address, ph_num: this.state.ph_num,
												est_time: est_time, quote: this.state.quote, status: this.state.status, 
												comments: this.state.comments, id: this.state.id }
			try {
				var response = await axios.post(this.state.ip + "EditJob", payload)
				if (response.data == 'Done') {
					if (this.state.account == 'ADMIN') {
						this.props.navigation.navigate( 'Data', {account: this.state.account, reload: true, server: this.state.ip, email: this.state.email, pass: this.state.pass});
					} else if (this.state.account == 'EMP') {
						this.props.navigation.navigate( 'Emp Data', {account: this.state.account, reload: true, server: this.state.ip, email: this.state.email, pass: this.state.pass});	
					}
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
			let payload = { email: this.state.email, pass: this.state.pass, id: this.state.id }
			try {
				var response = await axios.post(this.state.ip + "DeleteJob", payload)
				if (response.data == 'Done') {
					this.props.navigation.navigate( 'Data', {reload: true, server: this.state.ip, email: this.state.email, pass: this.state.pass});
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
		if (this.state.account == 'ADMIN') {
			this.setState({editable: true})
		}
	}
	
  	render() {
        	return (
				<View style={styles(this.state).container}>
					<View style={styles(this.state).buttonCont}>
					{this.state.editable && <TouchableOpacity 
						style={styles(this.state).button}
			        	onPress={this.createTwoButtonAlert}
			        	activeOpacity={0.4}>
			        	<Text>Delete</Text>
			      	</TouchableOpacity>}
			      	</View>
					<View style={styles(this.state).innerView}>
						<Text style={styles(this.state).headers}>Job description *</Text>
				 		<TextInput
				 		editable={this.state.editable}
				        style={styles(this.state).job_input}
				        defaultValue={this.props.route.params.items.job_desc}
				        onChangeText={(e) => this.setState({ job_desc: e})}
				      	/>
						<Text style={styles(this.state).headers}>Job Address *</Text>
						<TextInput
						editable={this.state.editable}
				        style={styles(this.state).address_input}
				        defaultValue={this.props.route.params.items.job_address}
				        onChangeText={(e) => this.setState({ job_address: e})}
				      	/>
				      	<Text style={styles(this.state).headers}>Estimated time</Text>
				      	<View style={{ flexDirection: 'row'}}>
							<TextInput
							editable={this.state.editable}
							placeholder='NA'
					        style={styles(this.state).hour_input}
					        defaultValue={this.state.hours.toString()}
					        onChangeText={(e) => this.setState({ hours: e})}
					      	/>
					      	<Text style={styles(this.state).time}>hour(s)</Text>
							<TextInput
							editable={this.state.editable}
							placeholder='NA'
					        style={styles(this.state).minute_input}
					        defaultValue={this.state.minutes.toString()}
					        onChangeText={(e) => this.setState({ minutes: e})}
					      	/>
					      	<Text style={styles(this.state).time}>minutes</Text>
				      	</View>
				      	<Text style={styles(this.state).headers}>Quote (dollars)</Text>
						<TextInput
						editable={this.state.editable}
						placeholder='NA'
				        style={styles(this.state).quote_input}
				        defaultValue={this.state.quote}
				        onChangeText={(e) => this.setState({ quote: e})}
				      	/>
				      	{this.state.editable && <Text style={styles(this.state).headers}>Status</Text>}
						{this.state.editable && <SelectDropdown
							renderDropdownIcon={(isOpened) => {
				              return (
				                <FontAwesome
				                  name={isOpened ? "chevron-up" : "chevron-down"}
				                  color={"#444"}
				                  size={18}
				                />
				              );
				            }}
							dropdownIconPosition={'right'}
							buttonStyle={styles(this.state).status}
							data={this.state.items}
							defaultButtonText={this.state.status}
							onSelect={(selectedItem, index) => {
								this.setState({status: selectedItem})
							}}
							buttonTextAfterSelection={(selectedItem, index) => {

								return selectedItem
							}}
							rowTextForSelection={(item, index) => {

								return item
							}}
						/>}
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
				        
						<View style={styles(this.state).buttonConfirmContainer}>
							<TouchableOpacity 
								disabled={this.state.button}
								style={styles(this.state).buttonConfirm}
					        	onPress={this.callBackend}
					        	activeOpacity={0.4}>
					        	<Text>Confirm</Text>
					      	</TouchableOpacity>
						</View>
					</View>
				</View>
			)			
 
  	}
}



const styles = (state) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#EBECF4',

	},
	buttonCont: {
		flexDirection: 'row',
		padding: 20 * rem,
    	justifyContent: "flex-end",

	},
	button: {
		backgroundColor: 'pink',
		padding: 10 * rem,

		flexDirection: 'row',
		borderWidth: 1 * rem
	},
	innerView: {
    	padding: 50 * rem,
    	paddingTop: 10 * rem,
    	height: height,
    	width: width		
	},
	time: {
		paddingTop: 20 * rem,
		textAlign: "center",
    	justifyContent: "center",
    	fontSize: 15 * rem
	},
	cust: {
		paddingBottom: 10 * rem
	},
	headers:{
		textAlign: "center",
    	justifyContent: "center",
    	fontSize: 20 * rem
	},
	confirm: {
		paddingTop: 50 * rem
	},
	job_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[0],
	    paddingLeft: 10 * rem,		
		fontSize: 20 * rem
	},
	address_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[1],
	    paddingLeft: 10 * rem,	
	    fontSize: 20 * rem	
	},
	hour_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    flex: 0.5,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[2],
	    paddingLeft: 10 * rem,		
	    fontSize: 20 * rem
	},
	minute_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	   	flex: 0.5,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[3],
	    paddingLeft: 10 * rem,		
	    fontSize: 20 * rem
	},
	quote_input: {
		backgroundColor: 'white',
	    height: 40 * rem,

	    margin: 12 * rem,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[4],
	    paddingLeft: 10 * rem,	
	    fontSize: 20 * rem	
	},
	status: {
		backgroundColor: 'white',
		width: width - (124 * rem),
	    height: 40 * rem,
	    margin: 12 * rem,
	    borderWidth: 2 * rem,
	    borderColor: 'black',
	    paddingLeft: 10 * rem,	
	    fontSize: 20 * rem	
	},
	comments_input: {
		backgroundColor: 'white',
	    height: 40 * rem,
	    margin: 12 * rem,
	    borderWidth: 2 * rem,
	    borderColor: Object.values(state.bcolours)[5],
	    paddingLeft: 10 * rem,	
	    fontSize: 20 * rem	
	},
	buttonConfirmContainer: {
		flexDirection: 'row',
		padding: 20 * rem,
    	justifyContent: "center",
	},
	buttonConfirm: {
		backgroundColor: 'lightblue',
		padding: 10 * rem,
		flexDirection: 'row',
		borderWidth: 1 * rem
  }
});

