import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { isAlphaNumeric, convertTime, getWindowValues } from '../numeric.js';
import Icon from 'react-native-vector-icons/Feather';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import { CurrentJobs } from './CurrentJobs.js';

const {height, rem, width} = getWindowValues()

export default class EmpData extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true, reload: this.props.route.params.reload ?? false,
			pass: this.props.route.params.pass, email: this.props.route.params.email,
			ip: this.props.route.params.server,
			displayCur: [], curjobData: [], currentPage: 'Current Jobs',
			curJobIcon: <Icon name="tool" size={40 * rem} color="red"/>,
		}
		this.timer = null;
	}

	searchData(list) {
		let searchedString = this.state.searchbox.toLowerCase()
		let searchdata = []
		list.forEach((element) => {
			let values = Object.values(element)
			for (var i = 0; i < values.length; i++) {
				try {
					if (values[i] != null && values[i].toString().toLowerCase().includes(searchedString)) {	
						searchdata.push(element)
						break;
					}
				} finally {
					
				}
			}
		})
		return searchdata
	}

	confirmSearch(val) {
		if (isAlphaNumeric(val)) {
			this.setState({searchbox: val, searchborder: '#ebecf4'})
			this.setState({displayCur: this.searchData(this.state.curjobData)})
			this.refreshList()
					
		} else {
			this.setState({searchborder: 'red'})
			this.textInput.blur()
			alert('Input must be letters/numbers only')
		}
	}
	
	refreshList() {
		this.setState({ displayList: <CurrentJobs state={this.state} />})
	}
	
	async getData() {
		let payload = { email: this.state.email, pass: this.state.pass }
		await axios
	  		.post(this.state.ip + "SearchJob", payload)
	  		.then(response => {
	     		return response.data
	  		})
	  		.then(val => {
				val.forEach((element) => {
					element['time'] = convertTime(element.est_time)
				})
				this.setState({ curjobData: val});	
	  		})
	  		.catch(error => {
	     		console.log(error)
	  		})
	}
    
    changeText(val) {
		this.setState({text: val})
	}
	
   	handleCheck = () => {
    	clearTimeout(this.timer);
    	this.timer = setTimeout(() => {
      		this.confirmSearch(this.state.text);
    	}, 500);
  	}
  
     
	async componentDidMount() {
		this.setState({loading: true})
		await this.getData()
		this.setState({loading: false})
		this.focusListener = this.props.navigation.addListener('focus', async () => {
				this.setState({reload: this.props.route.params.reload ?? false})
		})
	}
    
   	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps == this.props && nextState == this.state) {
			return false
		}
		return true
	}
	
	async componentDidUpdate(prevProps, prevState) {
		if (prevState.reload == false && this.state.reload == true) {	
			this.setState({loading: true})
			await this.getData()
			this.setState({loading: false, reload: false})
			this.props.route.params.reload = false
		}
	    if (prevState.text !== this.state.text) {
      		this.handleCheck();
    	}
  	}
    
     render() {
		return (
			<View style={styles(this.state).container}>
				<View style={styles(this.state).headerContainer}>
				<Text style={styles(this.state).headerPage}>{this.state.currentPage}</Text>
				</View>
	            <View style={styles(this.state).listContainer}>
	            	{this.state.loading && <ActivityIndicator color="black" size="large"  />}
					{this.state.displayList}
				</View>
				
	            <View style={styles(this.state).searchbar}>
			 		<TextInput 
			 		ref={input => { this.textInput = input }}
			        style={styles(this.state).searchbox}
			        placeholder="Filter search"
			        onChangeText={(val) => this.changeText(val)}
      				/>
					<TouchableOpacity 
						style={styles(this.state).newItem}
			        	onPress={this.state.newItem[2]}
			        	activeOpacity={0.4}>
			        	{this.state.newItem[0]}
			        	<Text style={styles(this.state).newItemButtons}>{this.state.newItem[1]}</Text>
			      	</TouchableOpacity>
	            </View>
				
			 	<View style={styles(this.state).boxhold}>
					<TouchableOpacity 
						style={styles(this.state).bottomButton}
						disabled={this.state.curjob}
			        	onPress={() => {
										this.handleBottomMenu('curJob')
								}}
			        	activeOpacity={0.4}>
			        	{this.state.curJobIcon}
			        	<Text style={styles(this.state).bottomCurJobButton}>Current Jobs</Text>
			      	</TouchableOpacity>
					<TouchableOpacity 
						style={styles(this.state).bottomButton}
						disabled={this.state.completejob}
			        	onPress={() => {
										this.handleBottomMenu('completejob')
								}}
			        	activeOpacity={0.4}>
			        	{this.state.completeJobIcon}
			        	<Text style={styles(this.state).bottomCompleteJobButton}>Complete Jobs</Text>
			      	</TouchableOpacity>
					<TouchableOpacity 
						style={styles(this.state).bottomButton}
						disabled={this.state.cust}
			        	onPress={() => {
										this.handleBottomMenu('cust')
								}}
			        	activeOpacity={0.4}>
						<View>
			        	{this.state.custIcon}
			        	</View>
			        	<Text style={styles(this.state).bottomCustomersButton}>Customers</Text>
			      	</TouchableOpacity>
		        </View>
		 	</View>
 		);
    }
}

const styles = (state) => StyleSheet.create({
	container: {
		flex: 1,
        backgroundColor: "#ebecf4",
    },
    headerContainer: {
		justifyContent: "center",
		alignItems: "center", 
		backgroundColor: '#dcdff2',
		flex: 0.7,
		paddingTop: 20 * rem
	},
	headerPage: {
		fontSize: 30 * rem,
	},
	listContainer: {
		backgroundColor: '#ebecf4',
		flex: 7,
	},
	boxhold: {
		backgroundColor: '#dcdff2',
		flexDirection: 'row',
		paddingBottom: 5 * rem,
		paddingTop: 5 * rem,
		justifyContent: 'space-evenly',
		flex: 0.8
	},
	searchbar: {
		justifyContent: 'space-evenly',
		flexDirection: 'row',
		paddingBottom: 20 * rem,
		paddingTop: 20 * rem,
		flex: 0.5,
		backgroundColor: '#ebecf4'
	},
	searchbox: {
		paddingLeft: 15 * rem,
		flexDirection: 'row',
		flex: 0.6,
		marginBottom: 10 * rem,
		fontSize: 20 * rem,
		borderRadius: 20 * rem,
		borderWidth: 1 * rem,
		borderColor: state.searchborder,
		backgroundColor: 'white'
	},
	newItem: {
		flexDirection: 'column', 
		flex: 0.3, 
		justifyContent: "center",
		alignItems: "center", 
	},
	bottomButton:{
		justifyContent: "center",
		alignItems: "center", 
	},
	newItemButtons: {
		justifyContent: "center",
		alignItems: "center", 
	},
	bottomCurJobButton: {
		color: state.curJobIcon['props'].color,
		fontSize: 14 * rem,
		paddingTop: 10 * rem
	},
	bottomCompleteJobButton: {
		color: state.completeJobIcon['props'].color,
		fontSize: 14 * rem,
		paddingTop: 10 * rem
	},
	bottomCustomersButton: {
		color: state.custIcon['props'].color,
		fontSize: 14 * rem,
		paddingTop: 10 * rem
	}

});
