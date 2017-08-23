exports.GetNotification = (type, id) => {
    let success = {
        'postCreated': 'Post succesfully created!',
        'postDeleted': 'Post successfully deleted!',
        'postUpdated': 'Post successfully updated!',
        'userCreated': 'Your account was successfully created!',
        'userDeleted': 'Your account has been deleted!',
        'userUpdated': 'Your account has been updated!'
    }   

    let error = {
        'allFieldsRequired': 'You must fill in all required fields!',
        'duplicateUser': 'Oops! This user already exists, please try again!',
        'incorrectPassword': 'Oops! Check your password and try again!',
        'invalidEmailFormat': 'Please check the format of your email and try again!',
        'loginError': 'There was an error signing in, please try again!',
        'passwordMismatch': 'Your passwords do not match!',
        'postLikeError': 'Oops! There was a problem liking that post, please try again!',
        'postNotDeleted': 'Oops! There was a problem deleting your post, please try again!',
        'postNotFound': 'Oops! There was a problem locating that post, please try again!',
        'postsNotFound': 'Oops! There was a problem retrieving posts, please try again!',
        'postNotSaved': 'Oops! There was a problem creating your post, please try again!',
        'postNotUpdated': 'Oops! There was a problem updating your post, please try again!',
        'userFollowError': 'Oops! There was a problem following that user, please try again!',
        'userNotCreated': 'Oops! There was an error creating your account, please try again!',
        'userNotFound': 'This user was not found!',
        'userPostsNotFound': 'Oops! There was an error retrieving your posts, please try again!',
        'usersLookupError': 'Oops! There was a problem retrieving users, please try again!'
    }

    if (type === 'success') {
        return success[id]
    } else {
        return error[id]
    }
}