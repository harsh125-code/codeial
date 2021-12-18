{
  // method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "post",
        url: "/posts/createpost",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container>ul").prepend(newPost);
          let deletebutton = $("#delete-post-button");
          deletePost(deletebutton, newPost);
          // call the create comment class
          new PostComments(data.data.post._id);

          // CHANGE :: enable the functionality of the toggle like button on the new post
          new ToggleLike($(' #like-button ', newPost));

          new Noty({
            theme: "relax",
            text: "Post published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // method to create a post in DOM
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
                  <p>
                      
                      <small>
                          <a id="delete-post-button"  href="/posts/deletepost/${post._id}">Delete</a>
                      </small>
                     
                      ${post.content}
                      <br>
                      <small>
                      ${post.user.name}
                      </small>
                      <small>
                      ${post.createdAt}
                      </small>
                      <small>
                      <a class="toggle-like-button" href="/like/toggle/?id=${post._id}&type=Post" >${post.likes.length}Like</a>
                      </small
                  </p>
                  <div class="post-comments">
                      
                          <form id="post-${post._id}-comments-form" action="/comment/createcreate" method="POST">
                              <input type="text" name="content" placeholder="Type Here to add comment..." required>
                              <input type="hidden" name="post" value="${post._id}" >
                              <input type="submit" value="Add Comment">
                          </form>
             
              
                      <div class="post-comments-list">
                          <ul id="post-comments-${post._id}">
                              
                          </ul>
                      </div>
                  </div>
                  
              </li>`);
  };

  // method to delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Post Deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
  let convertPostsToAjax = function () {
    $("#posts-list-container>ul>li").each(function () {
      let self = $(this);
      let deleteButton = $(" #delete-post-button", self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop("id").split("-")[1];
      new PostComments(postId);
    });
  };

  createPost();
  convertPostsToAjax();
}
