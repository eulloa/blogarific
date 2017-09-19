$(function(){

    $('header li.more').on('click', function() {
        $(this).find('ul').toggleClass('show')
        $(this).toggleClass('close')
    })
   
    $('span.likePost').on('click', function() {
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
    $('.comments span').on('click', function() {
        $(this).parents('.comments').find('form').toggleClass('noshow');
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
    span.next('p.likes').text("Likes: " + likes)
    span.fadeTo(250, 0, function(){
        span.css('display', 'none')
    })
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