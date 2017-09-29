module.exports = {
    /**
     * 
     * @param {*} array 
     * @param {*} userId 
     * Helper used to identify whether a post has already been liked. Posts should only be liked
     * by a given user once.
     */
    CreatePaginationPosts(array, userId) {
        if (typeof userId === undefined || userId === '') return array;

        let posts = array.map((post) => {
            post.alreadyLiked = false;

            if (post.likedBy.includes(userId)) {
                post.alreadyLiked = true;
            }

            return post;
        });

        return posts;
    }
}