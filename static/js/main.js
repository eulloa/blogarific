$(function(){

    $('header li.more').on('click', function() {
        $(this).find('ul').toggleClass('show')
        $(this).toggleClass('close')
    })
   
    $('span.like-post').on('click', function() {
        let postid = $(this).attr("data-postid")
        likePost($(this), postid)
    })

    $('span.follow').on('click', function() {
        let followid = $(this).attr("data-followid")
        followUser(followid)
    })

    $('span.unfollow').on('click', function() {
        console.log('unfollow')
    })

    //comments
    $('.comments-form i').on('click', function() {
        $(this).parent().find('form').toggleClass('noshow');
    });

    $('.comments-form form').on('submit', function(e) {
        e.preventDefault();

        if (!isValidForm($(this)))
            return;

        let postSection = $(this).parents('.post-content');

        let comment = $(this).find('input[name=comment]').val();

        let data = {
            "comment": comment
        }

        let postid = $(this).find('input[name=postid]').val();

        $.ajax({
            url: '/posts/comment/' + postid,
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            type: 'POST',
            data: JSON.stringify(data),
            xhrFields: { withCredentials: true },
            error: (e) => {
                console.log(e);
            }
        }).then((res) => {
            resetForm(postSection);
            updateCommentCount(postSection);
            postSection.find('ul.comments').removeClass('noshow').append(createComment(res));
        });
    });

    $('.view-comments').on('click', function() {
        let parent = $(this).parents('.post-content');
        parent.find('ul.comments').removeClass('noshow');
        parent.find('span.hide-comments').removeClass('noshow');
        $(this).addClass('noshow');
    });

    $('.hide-comments').on('click', function() {
        let parent = $(this).parents('.post-content');
        parent.find('ul.comments').addClass('noshow');
        parent.find('span.view-comments').removeClass('noshow');
        $(this).addClass('noshow');
    });
});

likePost = (span, postid) => {
    let data = {
        "id": postid
    }

    $.ajax({
        url: '/posts/like/' + postid,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        type: 'POST',
        data: JSON.stringify(data),
        xhrFields: { withCredentials: true },
        error: (e) => {
            console.log(e)
        }
    }).then((res) => {
        updateLikes(span, res)
    })
}

updateLikes = (span, likes) => {
    span.parents('.post-content').find('p.likes b').text(likes);
    span.fadeTo(250, 0, function(){
        span.css('display', 'none');
    });
}

followUser = (followid) => {
    let data = {
        "id": followid
    }

    $.ajax({
        url: '/users/follow/' + followid,
        contentType: 'application/json;charset=UTF-8',
        type: 'POST',
        data: JSON.stringify(data),
        xhrFields: { withCredentials: true },
        error: (e) => {
            console.log(e)
        }
    })
}

createComment = (comment) => {
    let commentBody = comment.comment;
    let date = formatDate(comment.date);
    return $('<li>', { text: commentBody + ' - ' + date });
}

formatDate = (date) => {
    return new Date(date).toDateString();
}

resetForm = (postSection) => {
    postSection.find('form')[0].reset();
    postSection.find('i').trigger('click');
}

updateCommentCount = (postSection) => {
    let num =  parseInt(postSection.find('span.num-of-comments').text()) + 1;
    postSection.find('span.num-of-comments').text(num);
}

isValidForm = (form) => {
    let isValid = true;

    form.find('input[type=text]').each(function(){
        if ($(this)[0].value === '') {
            isValid = false;
            $(this)[0].classList.add('error');
        }
    });

    return isValid;
}