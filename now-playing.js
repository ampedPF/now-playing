var newArtist;
var newTitle;
var oldArtist;
var oldTitle;
var shown = false;

var artistPath = "./data/np_artist.txt";
var titlePath = "./data/np_title.txt";
var coverPath = "./data/np_cover.png";

var maxArtistLength = 25;
var maxTitleLength = 30;

function hideText() {
  $("#artist").animate({
    opacity: 0
  }, 300, function () {
    document.getElementById("title").classList.remove("scrolling");
  });
  $("#title").animate({
    opacity: 0
  }, 300, function () {
    document.getElementById("artist").classList.remove("scrolling");
  });


}

function updateText() {
  document.getElementById("title").innerHTML = newTitle;
  document.getElementById("artist").innerHTML = newArtist;
}

function showText() {
  if (newArtist.length > maxArtistLength) {
    $("#artist").animate({
      opacity: 0
    }, 300, function () {
      $("#artist").css("opacity", "1");
    });
  } else {
    $("#artist").animate({
      opacity: 1
    }, 300);
  }

  if (newTitle.length > maxTitleLength) {
    $("#title").animate({
      opacity: 0
    }, 300, function () {
      $("#title").css("opacity", "1");
    });
  } else {
    $("#title").animate({
      opacity: 1
    }, 300);
  }

  if (newArtist.length > maxArtistLength) setTimeout(function () {
    document.getElementById("artist").classList.add("scrolling");
  }, 300);
  if (newTitle.length > maxTitleLength) setTimeout(function () {
    document.getElementById("title").classList.add("scrolling");
  }, 300);

}

function checkUpdate() {
  // console.log("checkUpdate");
  $.get(artistPath, function (artist) {
    newArtist = artist.replace(/&/g, "&amp;");
  }).then(
    $.get(titlePath, function (title) {
      newTitle = title.replace(/&/g, "&amp;");
    })).then(displayData);

  setTimeout(checkUpdate, 2000);
}

function displayData() {
  // console.log("displayData");
  var dataValidated = false;
  var dataChanged = false;

  if (newTitle.length > 1 && newArtist.length > 1) {
    dataValidated = true;
  }
  if (newTitle != document.getElementById("title").innerHTML || newArtist != document.getElementById("artist").innerHTML) {
    dataChanged = true;
    oldTitle = document.getElementById("title").innerHTML;
    oldArtist = document.getElementById("artist").innerHTML;
  }

  if (!shown) {
    $("#container").css("opacity", "0");
  }

  if (!dataValidated && shown) {
    // console.log("no valid data");
    //hide div
    $("#container").fadeOut(500);
    shown = false;
  }

  if (dataValidated) {
    if (!shown) {
      //display div
      $("#container").css("opacity", "1");
      $("#container").fadeIn(500);
      shown = true;
    }
    if (dataChanged) {
      console.log("previous song: " + oldArtist + " - " + oldTitle);
      hideText();
      setTimeout(updateText, 300);
      setTimeout(showText, 400);
      var imgpath = coverPath + "?t=" + newTitle + newArtist;
      $("#cover").fadeOut(500, function () {
        document.getElementById("cover").setAttribute("src", imgpath);
        $("#cover").fadeIn();
      });
    }
  }

}

$(document).ready(checkUpdate);