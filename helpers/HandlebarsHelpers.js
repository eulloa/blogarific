const md5 = require('js-md5')
const PostController = require('../controllers/PostController')

exports.GetGravatar = (email) => {
    return 'https://www.gravatar.com/avatar/' + md5(email) + '.jpg' 
}

exports.FormatDate = (date) => {
    return date.toDateString()   
}

exports.HasBeenLiked = () => {

}