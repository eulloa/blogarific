const md5 = require('js-md5')

exports.GetGravatar = (email) => {
    return 'https://www.gravatar.com/avatar/' + md5(email) + '.jpg';
}

exports.FormatDate = (date) => {
    return date.toDateString();
}

exports.GetArrayLength = (array) => {
    return array.length;
}

exports.FormatMessage = (array) => {
    return array.length === 1 ? 'comment' : 'comments';
}

exports.IsSelected = (a, b) => {
    return a === b ? 'active': '';
}