var activeID = 0;

// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  $("#save-btn").on("click", function(event) {
    event.preventDefault();
    var id = $(this).attr("data-id");

    // Send the PUT request.
    $.ajax("/savedarticles/" + id, {
      type: "PUT"
    }).then(function() {
      console.log("saved");
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $("#scrape-btn").on("click", function(event) {
    $.ajax("/scrape", {
      type: "GET"
    }).then(function() {
      console.log("scraping");
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $(document).on("click", ".comment-btn", function(event) {
    console.log("this is clicking");
    console.log($(this).attr("data-id"));
    activeID = $(this).attr("data-id");
    return activeID;
  });

  $("#save-comment").on("click", function(event) {
    event.preventDefault();
    console.log(activeID);
    var id = activeID;

    var name = $("#comment-name")
      .val()
      .trim();
    var text = $("#comment-text")
      .val()
      .trim();

    // Send the PUT request.
    $.ajax("/comment/" + id, {
      type: "POST",
      data: {
        name: name,
        text: text
      }
    }).then(function() {
      console.log("commenting");
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $(".delete-comment").on("click", function(event) {
    event.preventDefault();
    var commentId = $(this).attr("data-id");
    var id = activeID;
    console.log("comment id");
    console.log(commentId);
    console.log("id");
    console.log(id);
    $.ajax({
      url: "/article/" + id + "/comment/" + commentId,
      type: "DELETE"
    }).then(function() {
      location.reload();
    });
  });
});
