import React from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { isAlphaNumeric, convertTime, getWindowValues } from '../numeric.js';



export default class Data extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
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
			cust: false
		}
	}

	confirmSearch(val)  {
		if (isAlphaNumeric(val)) {
			this.setState({searchbox: val})
			let searchedString = val.toLowerCase()
	
					let searchdata = []
					this.state.curjobData.forEach((element) => {
						if (element.est_time.toLowerCase().includes(searchedString)) {
							searchdata.push(element)
						} else if (element.full_name.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						} else if (element.job_address.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						} else if (element.ph_num.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						} else if (element.quote.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						} else if (element.job_desc.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						} else if (element.comments.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						}
						this.setState({displayCur: searchdata})
					})
	
					searchdata = []
					this.state.alljobData.forEach((element) => {
						if (element.est_time.toLowerCase().includes(searchedString)) {
							searchdata.push(element)
						} else if (element.full_name.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						} else if (element.job_address.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						} else if (element.ph_num.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						} else if (element.quote.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						} else if (element.job_desc.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						} else if (element.comments.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						}
						this.setState({displayAll: searchdata})
					})				

					searchdata = []
					this.state.custData.forEach((element) => {
						if (element.full_name.toLowerCase().includes(searchedString)) {
							searchdata.push(element)
						} else if (element.address.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						} else if (element.ph_num.toLowerCase().includes(searchedString)) {
							searchdata.push(element)		
						}
						this.setState({displayCust: searchdata})
					})	


		} else {
			alert('Input must be letters/numbers only')
		}
	}
	
	
	componentDidMount() {
	  	this.focusListener = this.props.navigation.addListener('focus', () => {
			axios
		  		.post(this.state.ip + "SearchJob", this.state.pass)
		  		.then(response => {
		     		return response.data
		  		})
		  		.then(val => {
					this.setState({ curjobData: val, displayCur: val });	
		  		})
		  		.catch(error => {
		     		console.log(error)
		  		})
			axios
		  		.post(this.state.ip + "SearchAllJobs", this.state.pass)
		  		.then(response => {
		     		return response.data
		  		})
		  		.then(val => {
					this.setState({ alljobData: val, displayAll: val});	
		  		})
		  		.catch(error => {
		     		console.log(error)
		  		})
			axios
		  		.post(this.state.ip + "SearchCustomer", this.state.pass)
		  		.then(response => {
		     		return response.data
		  		})
		  		.then(val => {
					this.setState({ custData: val, displayCust: val});	
		  		})
		  		.catch(error => {
		     		console.log(error)
		  		})
	  });
	}
	
	
	pageLayout(style, displaydata, render, newItem) {
		return (
				<View style={styles(this.state).container}>
		            <View style={styles(this.state).listContainer}>
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
					        	onPress={newItem[1]}
					        	activeOpacity={0.4}>
					        	<Text style={styles(this.state).bottomButtons}>{newItem[0]}</Text>
					      	</TouchableOpacity>
			            </View>
			            <View style={styles(this.state).boxhold}>
							<TouchableOpacity 
								disabled={this.state.curjob}
								style={styles(this.state).currentJobs}
					        	onPress={() => {
									this.setState({curjob: true, cust: false, alljob: false, buttonState: [1, 'red', 'lightblue', 0, 'black', 'grey', 0, 'black', 'grey']})}}
					        	activeOpacity={0.4}>
					        	<Text style={styles(this.state).bottomButtons}>Current Jobs</Text>
					      	</TouchableOpacity>
							<TouchableOpacity 
								disabled={this.state.alljob}
								style={styles(this.state).allJobs}
					        	onPress={() => {
									this.setState({curjob: false, cust: false, alljob: true, buttonState: [0, 'black', 'grey', 1, 'red', 'lightblue', 0, 'black', 'grey']})}}
					        	activeOpacity={0.4}>
					        	<Text style={styles(this.state).bottomButtons}>All Jobs</Text>
					      	</TouchableOpacity>
							<TouchableOpacity 
								disabled={this.state.cust}
								style={styles(this.state).cust}
					        	onPress={() => {
									this.setState({curjob: false, cust: true, alljob: false, buttonState: [0, 'black', 'grey', 0, 'black', 'grey', 1, 'red', 'lightblue']})}}
					        	activeOpacity={0.4}>
					        	<Text
					        	style={styles(this.state).bottomButtons}>Customers</Text>
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
			let newJob = ['New Job', () => this.props.navigation.navigate('New Job', { server: this.state.ip, job_data: [], cust_data: this.state.custData, password: this.state.pass })]
	        return (
				this.pageLayout(styles(this.state).jobs, this.state.displayCur, this.renderJob, newJob)
	        );
		} else if (this.state.alljob == true) {
			let newJob = ['New Job', () => this.props.navigation.navigate('New Job', { server: this.state.ip, job_data: [], cust_data: this.state.custData, password: this.state.pass })]
			return (
				this.pageLayout(styles(this.state).jobs, this.state.displayAll, this.renderAllJob, newJob)
		    );			
    	} else if (this.state.cust) {
			let newCust = ['New Customer', () => this.props.navigation.navigate('New Customer', { server: this.state.ip, job_data: [], cust_data: [], password: this.state.pass })]
			return (
				this.pageLayout(styles(this.state).customers, this.state.displayCust, this.renderCustomer, newCust)
		    );
		}
    }

}


const {height, rem, width} = getWindowValues()

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
	filterBox: {
		flexDirection: 'row',
		flex: 1
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
    // List (data) container
	listContainer: {
		backgroundColor: '#e6e7f2',
		flex: 6,
        margin: 15 * rem,
        marginTop: 50 * rem,
        paddingTop: 10 * rem
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
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		flex: 0.8
	},

	currentJobs: {					
		flexDirection: 'row', 
		flex: 0.3, 
		justifyContent: "center",
		alignItems: "center", 		
		borderWidth: Object.values(state.buttonState)[0]  * rem,
		margin: 20 * rem, 
		borderColor: Object.values(state.buttonState)[1],
		backgroundColor: Object.values(state.buttonState)[2]
	},
	allJobs: {					
		flexDirection: 'row', 
		flex: 0.3, 
		justifyContent: "center",
		alignItems: "center", 	
		borderWidth: Object.values(state.buttonState)[3] * rem,
		margin: 20 * rem, 
		borderColor: Object.values(state.buttonState)[4],
		backgroundColor: Object.values(state.buttonState)[5]
	},
	cust: {					
		flexDirection: 'row', 
		flex: 0.3, 
		justifyContent: "center",
		alignItems: "center", 		
		borderWidth: Object.values(state.buttonState)[6] * rem,
		margin: 20 * rem, 
		borderColor: Object.values(state.buttonState)[7],
		backgroundColor: Object.values(state.buttonState)[8]
	},
	searchbar: {
		justifyContent: 'space-evenly',
		flexDirection: 'row',
		paddingBottom: 20 * rem,
		flex: 0.4,

	},
	searchbox: {
		paddingLeft: 10 * rem,
		flexDirection: 'row',
		flex: 0.5,
		borderWidth: 1 * rem,
		marginBottom: 10 * rem,
		fontSize: 20 * rem,
		backgroundColor: 'white'
	},
	newItem: {
		flexDirection: 'row', 
		flex: 0.2, 
		justifyContent: "center",
		alignItems: "center", 
		borderWidth: 1 * rem,

		backgroundColor: 'lightblue'
	},
	bottomButtons:{
		fontSize: 20 * rem
	}

});
