var newTitle = "";
var newArtist = "";
var newAlbum = "";
var oldTitle = "";
var noldArtist = "";
var noldAlbum = "";

var visible = false;
var shown = false;
var displayPreviousSongInfo = false;

var artistPath = "./data/np_artist.txt";
var albumPath = "./data/np_album.txt";
var titlePath = "./data/np_title.txt";
var coverPath = "./data/np_cover.png";

var maxTitleLength = 30;
var maxArtistLength = 40;
var maxAlbumLength = 50;
var scrollingDelay = 1500;

function getInlineSongInfo(artist, title, album) {
  return artist + " - " + title + " [" + album + "]";
}

function previousSongInfoValidated() {
  return !(oldArtist.length == 0 || oldTitle.length == 0 || oldAlbum.length == 0)
}

function updateText() {
  document.getElementById("title").innerHTML = newTitle;
  document.getElementById("artist").innerHTML = newArtist;
  document.getElementById("album").innerHTML = newAlbum;
  if (previousSongInfoValidated()) {
    document.getElementById("previous").innerHTML = getInlineSongInfo(oldArtist, oldTitle, oldAlbum);
  }
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
      }, scrollingDelay);
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


function getAnimationDelay(containerCss, index) {
  let animationDelay = containerCss.animationDelay.split(',')[index].slice(0, -1);
  let animationDuration = containerCss.animationDuration.split(',')[index].slice(0, -1);
  return (parseFloat(animationDelay) + parseFloat(animationDuration)) * 1000;
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
    animationTimer = getAnimationDelay(containerCss, 0);
    setTimeout(function () {
      $("#container").removeClass("animateOut");
    }, animationTimer);
  }

  if (dataValidated) {
    if (!visible && !shown) {
      var containerEl = document.querySelector("#container");
      if (getComputedStyle(containerEl)) {
        var newc = containerEl.cloneNode(true);
        containerEl.parentNode.replaceChild(newc, containerEl);
        $("#container").addClass("animateIn");
        visible = true;
        shown = true;
        containerCss = getComputedStyle(document.querySelector("#container"));
        if (containerCss.animationName.indexOf(',') > 0) {
          holdTimer = getAnimationDelay(containerCss, 1);
          setTimeout(function () {
            $("#container").css("opacity", "0");
          }, holdTimer);
          visible = false;
        } else {
          animationTimer = getAnimationDelay(containerCss, 0);
          setTimeout(function () {
            $("#container").removeClass("animateIn");
            $("#container").css("opacity", "1");
          }, animationTimer);
        }
      }
    }
    if (dataChanged) {
      console.log("previous song:", getInlineSongInfo(oldArtist, oldTitle, oldAlbum));
      if (displayPreviousSongInfo && previousSongInfoValidated()) {
        $("#div-previous-row").css("opacity", "1");
      } else {
        $("#div-previous-row").css("opacity", "0");
      }


      console.log("current song:", getInlineSongInfo(newArtist, newTitle, newAlbum));
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

function main() {
  displayPreviousSongInfo = getComputedStyle(document.querySelector("#div-previous-row")).opacity != 0 ? true : false;
  checkUpdate();
}

$(document).ready(main);