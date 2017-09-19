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
            console.log(res);
        });
    });

    $('.view-comments').on('click', function() {
        $('ul.comments').removeClass('noshow');
        $('span.hide-comments').removeClass('noshow');
        $(this).addClass('noshow');
    });

    $('.hide-comments').on('click', function() {
        $('ul.comments').addClass('noshow');
        $('span.view-comments').removeClass('noshow');
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