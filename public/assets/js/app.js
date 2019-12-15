var activeID = 0;

$(function() {
  $("#save-btn").on("click", function(event) {
    event.preventDefault();
    var id = $(this).attr("data-id");

    // Send the PUT request.
    $.ajax("/savedarticles/" + id, {
      type: "PUT"
    }).then(function() {
      console.log("saved");
      location.reload();
    });
  });

  $("#scrape-btn").on("click", function(event) {
    $.ajax("/scrape", {
      type: "GET"
    }).then(function() {
      console.log("scraping");
      location.reload();
    });
  });

  $(document).on("click", ".comment-btn", function(event) {
    // In your ."add-comment" on-click, grab the data-id of that add-comment button, and use Bootstrap to show the modal with the ID of "modal-idgoeshere"
    console.log("this is clicking");
    console.log($(this).attr("data-id"));
    activeID = $(this).attr("data-id");

    $("#modal-" + activeID).modal("show");

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
      location.reload();
    });
  });

  $(".delete-comment").on("click", function(event) {
    event.preventDefault();
    var commentId = $(this).attr("data-id");
    var id = activeID;

    $.ajax({
      url: "/article/" + id + "/comment/" + commentId,
      type: "DELETE"
    }).then(function() {
      location.reload();
    });
  });
});
