import React from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { isAlphaNumeric, convertTime, getWindowValues } from '../numeric.js';
import Icon from 'react-native-vector-icons/Feather';
import FontIcon from 'react-native-vector-icons/FontAwesome';

const {height, rem, width} = getWindowValues()



export default class Data extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			curjobData: [],
			alljobData: [],
			custData: [],
			displayCur: [],
			displayAll: [],
			displayCust: [],
			pass: this.props.route.params.pass,
			ip: this.props.route.params.server,
			buttonState: [1, 'red', 'lightblue', 0, 'black', 'grey', 0, 'black', 'grey'],
			searchbox: '',
			curjob: true,
			alljob: false,
			cust: false,
			currentPage: 'Current Jobs',
			curJobIcon: [<Icon name="tool" size={40 * rem} color="red"/>, 'red'],
			allJobIcon: [<Icon name="book" size={40 * rem} color="black"/>, 'black'],
			custIcon: [<Icon name="users" size={40 * rem} color="black"/>, 'black'],
			newUserIcon: [<Icon name="user-plus" size={40 * rem} color="black"/>, 'black'],
			newJobIcon: [<FontIcon name="sticky-note-o" size={40 * rem} color="black"/>, 'black']
		}
	}

	confirmSearch(val)  {
		if (isAlphaNumeric(val)) {
			this.setState({searchbox: val})
			let searchedString = val.toLowerCase()
			
			let searchdata = []
			this.state.curjobData.forEach((element) => {
				let values = Object.values(element)
				for (var i = 0; i < values.length; i++) {
					if (values[i].toString().toLowerCase().includes(searchedString)) {	
						searchdata.push(element)
						break;
					}
				}
			})
			this.setState({displayCur: searchdata})
			
			
			searchdata = []
			this.state.alljobData.forEach((element) => {
				let values = Object.values(element)
				for (var i = 0; i < values.length; i++) {
					if (values[i].toString().toLowerCase().includes(searchedString)) {	
						searchdata.push(element)
						break;
					}
				}
			})
			this.setState({displayAll: searchdata})	
			
			
			searchdata = []
			this.state.custData.forEach((element) => {
				let values = Object.values(element)
				for (var i = 0; i < values.length; i++) {
					if (values[i].toString().toLowerCase().includes(searchedString)) {	
						searchdata.push(element)
						break;
					}
				}
			})
			this.setState({displayCust: searchdata})		
					
		} else {
			alert('Input must be letters/numbers only')
		}
	}
	
	
	async getData() {
		await axios
	  		.post(this.state.ip + "SearchJob", this.state.pass)
	  		.then(response => {
	     		return response.data
	  		})
	  		.then(val => {
				this.setState({ curjobData: val});	
	  		})
	  		.catch(error => {
	     		console.log(error)
	  		})
		await axios
	  		.post(this.state.ip + "SearchAllJobs", this.state.pass)
	  		.then(response => {
	     		return response.data
	  		})
	  		.then(val => {
				this.setState({ alljobData: val});	
	  		})
	  		.catch(error => {
	     		console.log(error)
	  		})
		await axios
	  		.post(this.state.ip + "SearchCustomer", this.state.pass)
	  		.then(response => {
	     		return response.data
	  		})
	  		.then(val => {
				this.setState({ custData: val});
	  		})
	  		.catch(error => {
	     		console.log(error)
	  		})
			if (this.state.searchbox == '') {
				this.setState({displayCur: this.state.curjobData, displayAll: this.state.alljobData, displayCust: this.state.custData})			
			} else {
				this.confirmSearch(this.state.searchbox)
			}
	}

	componentDidMount() {
	  	this.focusListener = this.props.navigation.addListener('focus', async () => {
			this.setState({displayCur: [], displayAll: [], displayCust: []})	
			this.setState({loading: true})
			await this.getData()
			this.setState({loading: false})	

	  });
	}
	
	handleBottomMenu(button) {
		if (button == 'curJob') {
			this.setState({currentPage: 'Current Jobs', curJobIcon: [<Icon name="tool" size={40 * rem} color="red"/>, 'red'],
																	 allJobIcon: [<Icon name="book" size={40 * rem} color="black"/>, 'black'],
																	 custIcon: [<Icon name="users" size={40 * rem} color="black"/>, 'black'], curjob: true, cust: false, alljob: false})			
		} else if (button == 'allJob') {
			this.setState({currentPage: 'All Jobs', curJobIcon: [<Icon name="tool" size={40 * rem} color="black"/>, 'black'],
																	 allJobIcon: [<Icon name="book" size={40 * rem} color="red"/>, 'red'],
																	 custIcon: [<Icon name="users" size={40 * rem} color="black"/>, 'black'], curjob: false, cust: false, alljob: true})			
		} else if (button == 'cust') {
			this.setState({currentPage: 'Customers', curJobIcon: [<Icon name="tool" size={40 * rem} color="black"/>, 'black'],
																	 allJobIcon: [<Icon name="book" size={40 * rem} color="black"/>, 'black'],
																	 custIcon: [<Icon name="users" size={40 * rem} color="red"/>, 'red'], curjob: false, cust: true, alljob: false})			
		}
	}
	
	pageLayout(style, displaydata, render, newItem) {
		return (
				<View style={styles(this.state).container}>
					<View style={styles(this.state).headerContainer}>
					<Text style={styles(this.state).headerPage}>{this.state.currentPage}</Text>
					</View>
		            <View style={styles(this.state).listContainer}>

						{this.state.loading && <ActivityIndicator color={"black"} size='large' />}

		                <FlatList
		                    style={style}
		                    initialNumToRender={7}
		                    data={displaydata}
		                    renderItem={({ item }) => render(item)}
		                    keyExtractor={item => item.id}
		                    showsVerticalScrollIndicator={false}
		                ></FlatList>
		            </View>
			            <View style={styles(this.state).searchbar}>
					 		<TextInput 
					        style={styles(this.state).searchbox}
					        placeholder="Filter search"
					        onChangeText={(val) => this.confirmSearch(val)}
		      				/>
							<TouchableOpacity 
								style={styles(this.state).newItem}
					        	onPress={newItem[2]}
					        	activeOpacity={0.4}>
					        	{newItem[0][0]}
					        	<Text style={styles(this.state).newItemButtons}>{newItem[1]}</Text>
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
					        	{this.state.curJobIcon[0]}
					        	<Text style={styles(this.state).bottomCurJobButton}>Current Jobs</Text>
					      	</TouchableOpacity>
							<TouchableOpacity 
								style={styles(this.state).bottomButton}
								disabled={this.state.alljob}
					        	onPress={() => {
												this.handleBottomMenu('allJob')
										}}
					        	activeOpacity={0.4}>
					        	{this.state.allJobIcon[0]}
					        	<Text style={styles(this.state).bottomAllJobButton}>All Jobs</Text>
					      	</TouchableOpacity>
							<TouchableOpacity 
								style={styles(this.state).bottomButton}
								disabled={this.state.cust}
					        	onPress={() => {
												this.handleBottomMenu('cust')
										}}
					        	activeOpacity={0.4}>
								<View>
					        	{this.state.custIcon[0]}
					        	</View>
					        	<Text style={styles(this.state).bottomCustomersButton}>Customers</Text>
					      	</TouchableOpacity>
			            </View>
		            </View>
		)
	}
    renderJob = job => {
		var time = convertTime(job.est_time)			
        return (
            <View style={styles(this.state).jobItem}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles(this.state).opac}
		       			onPress={
						() => this.props.navigation.navigate('Edit job', { server: this.state.ip, items: job, password: this.state.pass })
						}>
                    	<View style={{ flexDirection: "column", flex: 1, justifyContent: 'space-evenly' }}>
                     		<View style={{ flexDirection: "row", flex: 1, justifyContent: 'space-evenly' }}>
                        	    <Text style={styles(this.state).job_header_desc}>Job: {job.job_desc}</Text>

                        	    <Text style={styles(this.state).job_header_status}>Status: {job.job_status}</Text>
                        	 </View>
                        	<View style={{flexDirection: "row", flex: 1, justifyContent: 'space-evenly'  }}>

	                        	<View style={styles(this.state).sections}>
									<Text style={styles(this.state).header}>Customer</Text>
									<Text style={styles(this.state).name}>{job.full_name}</Text>
	
									<Text style={styles(this.state).name}>{job.ph_num}</Text>
			
				 					<Text style={styles(this.state).name}>{job.cust_address}</Text>
	                        	</View>
	                        	<View style={styles(this.state).sections}>
									<Text style={styles(this.state).header}>Job Details </Text>
									<Text style={styles(this.state).name}>{time.hours} hrs {time.minutes} mins</Text>
									<Text style={styles(this.state).name}>${job.quote}</Text>	
				 					<Text style={styles(this.state).name}>{job.job_address}</Text>
	                            </View>                        	
	                        	<View style={styles(this.state).sections}>
									<Text style={styles(this.state).header}>Comments </Text>
                        	    	<Text style={styles(this.state).name}>{job.comments}</Text>
							</View>

                            </View>
                		</View>
                   	</TouchableOpacity>
                </View>
            </View>
        );
    };
    
    renderAllJob = alljob => {
		let time = convertTime(alljob.est_time)
        return (
            <View style={styles(this.state).jobItem}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles(this.state).opac}
		       			onPress={
						() => this.props.navigation.navigate('Edit job', { server: this.state.ip, items: alljob, password: this.state.pass })
						}>
                    	<View style={{ flexDirection: "column", flex: 1, justifyContent: 'space-evenly' }}>
                    		<View style={{ flexDirection: "row", flex: 1, justifyContent: 'space-evenly' }}>
                        	    <Text style={styles(this.state).job_header_desc}>Job: {alljob.job_desc}</Text>

                        	    <Text style={styles(this.state).job_header_status}>Status: {alljob.job_status}</Text>
                        	 </View>
                        	<View style={{flexDirection: "row", flex: 1, justifyContent: 'space-evenly'  }}>

	                        	<View style={styles(this.state).sections}>
									<Text style={styles(this.state).header}>Customer</Text>
									<Text style={styles(this.state).name}>{alljob.full_name}</Text>
	
									<Text style={styles(this.state).name}>{alljob.ph_num}</Text>
			
				 					<Text style={styles(this.state).name}>{alljob.cust_address}</Text>
	                        	</View>
	                        	<View style={styles(this.state).sections}>
									<Text style={styles(this.state).header}>Job Details</Text>
									<Text style={styles(this.state).name}>{time.hours} hrs {time.minutes} mins</Text>
									<Text style={styles(this.state).name}>${alljob.quote}</Text>	
				 					<Text style={styles(this.state).name}>{alljob.job_address}</Text>
	                            </View>                        	
	                        	<View style={styles(this.state).sections}>
									<Text style={styles(this.state).header}>Comments </Text>
                        	    	<Text style={styles(this.state).name}>{alljob.comments}</Text>
							</View>

                            </View>
                		</View>
                   	</TouchableOpacity>
                </View>
            </View>
        );
    };



    renderCustomer = customer => {
        return (
            <View style={styles(this.state).customerItem}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity
                    	style={styles(this.state).custButtonEdit}
		       			onPress={
						() => this.props.navigation.navigate('Edit customer', { server: this.state.ip, items: customer, password: this.state.pass })
						}>
                    	<View style={{ flexDirection: "column", flex: 1, justifyContent: 'space-evenly' }}>
                        	<View style={{flexDirection: "row", flex: 1, justifyContent: 'space-evenly' }}>
                        		<View style={styles(this.state).sections}>
									<Text style={styles(this.state).header}>Name </Text>
									<Text style={styles(this.state).name}>{customer.full_name}</Text>
								</View>
								<View style={styles(this.state).sections}>
									<Text style={styles(this.state).header}>Address </Text>
			 						<Text style={styles(this.state).name}>{customer.address}</Text>
			 					</View>
			 					<View style={styles(this.state).sections}>
									<Text style={styles(this.state).header}>Phone </Text>
									<Text style={styles(this.state).name}>{customer.ph_num}</Text>
								</View>
                        	 </View>
                		</View>
                   	</TouchableOpacity>
                </View>
            </View>
        );
    };
    
     render() {
		if (this.state.curjob) {
			let newJob = [this.state.newJobIcon,'New Job', () => this.props.navigation.navigate('New Job', { server: this.state.ip, job_data: [], cust_data: this.state.custData, password: this.state.pass })]
	        return (
				this.pageLayout(styles(this.state).jobs, this.state.displayCur, this.renderJob, newJob)
	        );
		} else if (this.state.alljob) {
			let newJob = [this.state.newJobIcon,'New Job', () => this.props.navigation.navigate('New Job', { server: this.state.ip, job_data: [], cust_data: this.state.custData, password: this.state.pass })]
			return (
				this.pageLayout(styles(this.state).jobs, this.state.displayAll, this.renderAllJob, newJob)
		    );			
    	} else if (this.state.cust) {
			let newCust = [this.state.newUserIcon,'New Customer', () => this.props.navigation.navigate('New Customer', { server: this.state.ip, job_data: [], cust_data: [], password: this.state.pass })]
			return (
				this.pageLayout(styles(this.state).customers, this.state.displayCust, this.renderCustomer, newCust)
		    );
		}
    }

}




const styles = (state) => StyleSheet.create({
	job_header_desc: {	
        paddingTop: 5 * rem,
        paddingBottom: 5 * rem,
        fontSize: 23 * rem,

	},
	job_header_status: {	
        paddingTop: 5 * rem,
        paddingBottom: 5 * rem,
        fontSize: 23 * rem,

	},
	sections: {
		flexDirection: "column",
		flex: 0.5,
        borderWidth: 1 * rem,
        borderColor: "#EBECF4",
        paddingBottom: 3 * rem,
	},

    headerTitle: {
        fontSize: 20 * rem,
        fontWeight: "500"
    },
    jobs: {
        marginHorizontal: 16 * rem
    },
    jobItem: {
        backgroundColor: "#FFF",
        borderRadius: 5 * rem,
        padding: 8 * rem,
        flexDirection: "row",
        marginVertical: 5 * rem
    },
	// Whole screen
	container: {
		flex: 1,
        backgroundColor: "#EBECF4",

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
    // List (data) container
	listContainer: {
		backgroundColor: '#EBECF4',
		flex: 7,

	},
	// Data objects in list container
	customers: {
        marginHorizontal: 16 * rem
    },
    customerItem: {
        backgroundColor: "#FFF",
        borderRadius: 5 * rem,
        padding: 8 * rem,
        flexDirection: "row",
        marginVertical: 8 * rem
    },
    header: {
		justifyContent: 'space-evenly',
        paddingTop: 5 * rem,
        paddingBottom: 5 * rem,
		paddingLeft: 3 * rem,
        backgroundColor: "#FFF",
        alignItems: "center",
        borderBottomWidth: 1 * rem,
        borderBottomColor: "#EBECF4",
        fontSize: 20 * rem,

    },
    custName: {
		justifyContent: 'flex-start',
        fontSize: 20 * rem,
        fontWeight: "500",
        color: "#454D65",
        flex: 0.3
	},
    custAddress: {
		justifyContent: 'center',
        fontSize: 20 * rem,
        fontWeight: "500",
        color: "#454D65",
        flex: 0.3
	},
    custPhone: {
		justifyContent: 'flex-end',
        fontSize: 20 * rem,
        fontWeight: "500",
        color: "#454D65",
        flex: 0.3
	},
    name: {
		paddingLeft: 3 * rem,
        fontSize: 17 * rem,
        fontWeight: "500",
        color: "#454D65"
    },
    // Buttons etc outside of list container

	boxhold: {
		backgroundColor: '#dcdff2',
        borderTopWidth: 2 * rem,
        borderTopColor: "lightgrey",
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

	},
	searchbox: {
		paddingLeft: 10 * rem,
		flexDirection: 'row',
		flex: 0.6,
		borderWidth: 1 * rem,
		marginBottom: 10 * rem,
		fontSize: 20 * rem,
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
		color: Object.values(state.curJobIcon)[1],
		fontSize: 14 * rem,
		paddingTop: 10 * rem
	},
	bottomAllJobButton: {
		color: Object.values(state.allJobIcon)[1],
		fontSize: 14 * rem,
		paddingTop: 10 * rem
	},
	bottomCustomersButton: {
		color: Object.values(state.custIcon)[1],
		fontSize: 14 * rem,
		paddingTop: 10 * rem
	}

});
