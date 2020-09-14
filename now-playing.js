let newTitle, newArtist, newAlbum = "";
let oldTitle, oldArtist, oldAlbum = "";
var visible = false;
var shown = false;

var artistPath = "./data/np_artist.txt";
var albumPath = "./data/np_album.txt";
var titlePath = "./data/np_title.txt";
var coverPath = "./data/np_cover.png";

var maxTitleLength = 30;
var maxArtistLength = 40;
var maxAlbumLength = 50;

function updateText() {
  document.getElementById("title").innerHTML = newTitle;
  document.getElementById("artist").innerHTML = newArtist;
  document.getElementById("album").innerHTML = newAlbum;
}

function resetText(elem) {
  elem.promise().done((self) => {
    elem.removeClass("scrolling");
    elem.css("opacity", "0");
  });
}

function hideText() {
  resetText($("#title"));
  resetText($("#artist"));
  resetText($("#album"));
}

function animateText(elem, text, maxLength) {
  elem.promise().done((self) => {
    if (text.length > maxLength) {
      setTimeout(() => {
        elem.addClass("scrolling");
      }, 1500);
    }
    elem.fadeIn(500).promise().done(function () {
      elem.css("opacity", "1");
    });
  })
}

function showText() {
  animateText($("#title"), newTitle, maxTitleLength);
  animateText($("#artist"), newArtist, maxArtistLength);
  animateText($("#album"), newAlbum, maxAlbumLength);
}

function displayData() {
  var dataValidated = false;
  var dataChanged = false;

  if (newTitle.length > 1 && newArtist.length > 1 && newAlbum.length > 1) {
    dataValidated = true;
  }
  if (newTitle != document.getElementById("title").innerHTML || newArtist != document.getElementById("artist").innerHTML || newAlbum != document.getElementById("album").innerHTML) {
    oldTitle = document.getElementById("title").innerText;
    oldArtist = document.getElementById("artist").innerHTML;
    oldAlbum = document.getElementById("album").innerHTML;
    dataChanged = true;
    shown = false;
  }

  if (!dataValidated && visible) {
    $("#container").addClass("animateOut");
    $("#container").css("opacity", "0");
    visible = false;
    shown = false;
    containerCss = getComputedStyle(document.querySelector("#container"));
    let animationDelay = containerCss.animationDelay.slice(0, -1);
    let animationDuration = containerCss.animationDuration.slice(0, -1);
    animationTimer = (parseFloat(animationDelay) + parseFloat(animationDuration)) * 1000;
    // console.log(animationTimer);
    setTimeout(function () {
      $("#container").removeClass("animateOut");
    }, animationTimer);
  }

  if (dataValidated) {
    if (!visible && !shown) {
      let containerCss = getComputedStyle(document.querySelector("#container"))
      if (containerCss) {
        var cont = document.querySelector("#container");
        var newc = cont.cloneNode(true);
        cont.parentNode.replaceChild(newc, cont);
        $("#container").addClass("animateIn");
        visible = true;
        shown = true;
        containerCss = getComputedStyle(document.querySelector("#container"))
        // console.log(containerCss.animationName);
        if (containerCss.animationName.indexOf(',') > 0) {
          let holdDelay = containerCss.animationDelay.split(',')[1].slice(0, -1);
          let holdDuration = containerCss.animationDuration.split(',')[1].slice(0, -1);
          holdTimer = (parseFloat(holdDelay) + parseFloat(holdDuration)) * 1000;
          // console.log(holdTimer);
          setTimeout(function () {
            $("#container").css("opacity", "0");
          }, holdTimer);
          visible = false;
        } else {
          // console.log("fixed anim")
          let animationDelay = containerCss.animationDelay.slice(0, -1);
          let animationDuration = containerCss.animationDuration.slice(0, -1);
          animationTimer = (parseFloat(animationDelay) + parseFloat(animationDuration)) * 1000;
          // console.log(animationTimer);
          setTimeout(function () {
            $("#container").removeClass("animateIn");
          }, animationTimer);
          $("#container").css("opacity", "1");
          visible = true;
        }
      }
    }
    if (dataChanged) {
      console.log("previous song: " + oldArtist + " - " + oldTitle + " [" + oldAlbum + "]");
      console.log("current song: " + newArtist + " - " + newTitle + " [" + newAlbum + "]");
      hideText();
      setTimeout(updateText, 300);
      setTimeout(showText, 400);
      $("#cover").fadeOut(300, function () {
        document.getElementById("cover").src = coverPath + "?t=" + newTitle + newArtist;
        $("#cover").fadeIn(300);
      });
    }
  }

}

function checkUpdate() {
  $.get(titlePath, function (title) {
      newTitle = title.replace(/&/g, "&amp;");
    })
    .then(
      $.get(artistPath, function (artist) {
        newArtist = artist.replace(/&/g, "&amp;");
      }))
    .then(
      $.get(albumPath, function (album) {
        newAlbum = album.replace(/&/g, "&amp;");
      }))
    .then(displayData);

  setTimeout(checkUpdate, 1000);
}

$(document).ready(checkUpdate);