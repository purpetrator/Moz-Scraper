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
    // Send the PUT request.
    $.ajax("/scrape", {
      type: "GET"
    }).then(function() {
      console.log("scraping");
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $(document).on("click", ".comment", function(event) {
    console.log("this is clicking");
    console.log($(this).attr("data-id"));
    activeID = $(this).attr("data-id");
    return activeID;
  });

  $("#save-comment").on("click", function(event) {
    event.preventDefault();
    console.log(activeID);
    var id = activeID;
    // Send the PUT request.
    $.ajax("/comment/" + id, {
      type: "POST"
    }).then(function() {
      console.log("commenting");
      // Reload the page to get the updated list
      location.reload();
    });
  });

  // $(".delete-cat").on("click", function(event) {
  //   event.preventDefault();
  //   console.log("Delete button was clicked");
  //   var id = $(this).data("id");
  //   $.ajax("/api/cats/" + id, {
  //     type: "DELETE"
  //   }).then(function() {
  //     console.log("Deleted cat");
  //     location.reload();
  //   });
  // });
});
