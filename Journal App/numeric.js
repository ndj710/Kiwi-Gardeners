import { Dimensions } from 'react-native';

export function getWindowValues() {
	let { width, height } = Dimensions.get('window')
	let rem = (width / 380) / 1.5
	return {width, height, rem}
}

export function isValidEmail(str, empty=null) {
	var code, i, len;
	if (str.length == 0 && empty != null){
		return false;
	}
	for (i = 0, len = str.length; i < len; i++) {
		code = str.charCodeAt(i);
		if (!(code > 47 && code < 58) && 
    		!(code > 64 && code < 91) && 
    		!(code > 96 && code < 123) &&
    		!(code == 46) &&
    		!(code == 64)) { 
  				return false;
			}
	}
	return true;
};

export function isAlphaNumeric(str, empty=null) {
	var code, i, len;
	if (str.length == 0 && empty != null){
		return false;
	}
	for (i = 0, len = str.length; i < len; i++) {
		code = str.charCodeAt(i);
		if (!(code > 47 && code < 58) && 
    		!(code > 64 && code < 91) && 
    		!(code > 96 && code < 123) &&
    		!(code == 32) &&
    		!(code == 44)) { 
  				return false;
			}
	}
	return true;
};

export function isNumeric(str, empty=null) {
	var code, i, len;
	if (str.length == 0 && empty != null){
		return false;
	}
	for (i = 0, len = str.length; i < len; i++) {
		code = str.charCodeAt(i);
		if (!(code > 47 && code < 58)) {
  			return false;
		}
	}
	return true;
};
	
export function isMoney(str, empty=null) {
	let dot = false;
	var code, i, len;
	if (str.length == 0 && empty != null){
		return false;
	}
	for (i = 0, len = str.length; i < len; i++) {
		code = str.charCodeAt(i);
		if (str[i] == '.' && dot == true) {
			return false
		} else if (str[i] == '.') {
			dot = true
		} else if (!(code > 47 && code < 58)) {
  			return false;
		}
	}
	return true;
};
	
export function convertTime(jobtime) {
	if (jobtime == 'NA') {
		return {hours: 'NA',
				minutes: 'NA'
		}
	}
	let time = {
		hours: 0,
		minutes: 0
	};
	if (jobtime % 60 == 0){
		time.hours = jobtime / 60;
		time.minutes = 0;
	} else {
		time.hours = Math.floor(jobtime / 60);
		time.minutes = jobtime % 60;
	};
	return(time);
};
