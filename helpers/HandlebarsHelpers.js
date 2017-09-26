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

exports.DoPagination = (n, active) => {
    let returnVal = '';
    let isActive = false;

    for (let i = 0; i < n; i++) {
        let pageLink = i + 1;
        let pageNum = i + 1;

        isActive = (pageNum === parseInt(active)) ? true: false;

        returnVal += "<li><a class='" + (isActive ? 'active' : '') + "' href=?page=" + pageLink + ">" + pageLink + "</a></li>";
        isActive = false;
    }

    return returnVal;
}

exports.ShouldPaginateBack = (n, options) => {
    return (n > 1) ? options.fn(this) : options.inverse(this);
}

exports.PaginatePrevious = (n, options) => {
    return n - 1;
}

exports.ShouldPaginateForward = (n, totalPages, options) => {
    return (n < totalPages) ? options.fn(this) : options.inverse(this);
}

exports.PaginateNext = (n, options) => {
    console.log(options.hash);
    return parseInt(n) + 1;
}