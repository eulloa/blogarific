exports.IsNullOrEmpty = (check) => {
	let errors = false

	if (Object.prototype.toString.call(check) === '[object Array]') {
		for (let i = 0; i < check.length; i++) {
			if (!check[i]) {
				errors = true
			}

			if (check[i].trim() === '') {
				errors = true
			}
		}
	}

	else if (typeof check === 'string') {
		if (!check) {
			errors = true
		}

		if (check.trim() === '') {
			errors = true
		}
	}

	return errors
}

exports.Equals = (a, b) => {
	if (a === b) {
		return true
	} else {
		return false
	}
}

exports.ValidateEmail = (email) => {
	let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}

exports.ValidateDate = (dateString) => { 
    // Check pattern
    if(!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateString))
        return false;
 
    // Parse the date parts to integers
    var parts = dateString.split("/")
    var year = parseInt(parts[0], 10)
    var month = parseInt(parts[1], 10)
    var day = parseInt(parts[2], 10)
 
    if (year < 1000 || year > 3000 || month === 0 || month > 12)
        return false;
 
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
 
    // Adjust for leap years
    if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
        monthLength[1] = 29
 
    return day > 0 && day <= monthLength[month - 1]
}

exports.FlashRedirect = (req, res, redirectPath, type, message) => {
	if (typeof message !== undefined) {
		req.flash(type, message)
	} else {
		req.flash(type)
	}
	res.redirect(redirectPath)
}