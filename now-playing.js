var current = {};
current.title = "";
current.artist = "";
current.album = "";

var previous = {};
previous.title = "";
previous.artist = "";
previous.album = "";

var dataValidated = false;
var dataChanged = false;
var visible = false;
var shown = false;
var displayPreviousSongInfo = false;

var filepaths = {};
// filepaths.info = "./data/np_info.json";
filepaths.artist = "./data/np_artist.txt";
filepaths.album = "./data/np_album.txt";
filepaths.title = "./data/np_title.txt";
filepaths.cover = "./data/np_cover.png";

var maxLength = {};
maxLength.title = 30;
maxLength.artist = 35;
maxLength.album = 50;
maxLength.previous = 38;

var scrollingDelay = 1500;
var first_previous = true;

// function resetInfo() {
//   return {
//     "artist": "",
//     "album": "",
//     "disc_number": "",
//     "full_release_date": "",
//     "release_year": "",
//     "song_label": "",
//     "song_progress": "",
//     "song_length": "",
//     "time_left": "",
//     "title": "",
//     "track_number": ""
//   };
// }

function truncate(str, n) {
  var subString = "";
  if (str.length > n) {
    subString = str.substr(0, n - 1);
    subString = subString.substr(0, subString.lastIndexOf(" "));
    str = (subString.endsWith(",")) ? subString.substr(0, subString.lastIndexOf(",")) + '&hellip;' : subString + '&hellip;';
  }
  return str;
};

function getInlineSongInfo(artist, title, album) {
  if (!album) {
    return `${artist} – ${title}`;
  }
  return `${artist} – ${title} [${album}]`;
}

function previousSongInfoValidated() {
  return !(previous.artist.length == 0 || previous.title.length == 0 || previous.album.length == 0)
}

function updateText() {
  document.getElementById("title").innerHTML = current.title;
  document.getElementById("artist").innerHTML = current.artist;
  document.getElementById("album").innerHTML = current.album;
  if (previousSongInfoValidated()) {
    document.getElementById("previous").innerHTML = getInlineSongInfo(truncate(previous.artist, maxLength.previous), truncate(previous.title, maxLength.previous));
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
  resetText($("#previous"));
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
  animateText($("#title"), current.title, maxLength.title);
  animateText($("#artist"), current.artist, maxLength.artist);
  animateText($("#album"), current.album, maxLength.album);
  animateText($("#previous"), getInlineSongInfo(previous.artist, previous.title, previous.album), maxLength.previous);
}


function getAnimationDelay(containerCss, index) {
  let animationDelay = containerCss.animationDelay.split(',')[index].slice(0, -1);
  let animationDuration = containerCss.animationDuration.split(',')[index].slice(0, -1);
  return (parseFloat(animationDelay) + parseFloat(animationDuration)) * 1000;
}

function hideContainer() {
  $("#container").addClass("animateOut");
  $("#container").css("opacity", "0");

  containerCss = getComputedStyle(document.querySelector("#container"));
  animationTimer = getAnimationDelay(containerCss, 0);
  setTimeout(function () {
    $("#container").removeClass("animateOut");
  }, animationTimer);
}

function displayData() {
  dataValidated = false;
  dataChanged = false;

  if (current.title.length > 1 && current.artist.length > 1 && current.album.length > 1) {
    dataValidated = true;
  }

  if (current.title != document.getElementById("title").innerHTML || current.artist != document.getElementById("artist").innerHTML || current.album != document.getElementById("album").innerHTML) {
    previous.title = document.getElementById("title").innerText;
    previous.artist = document.getElementById("artist").innerHTML;
    previous.album = document.getElementById("album").innerHTML;
    dataChanged = true;
    shown = false;
  }

  if (!dataValidated && visible) {
    hideContainer();
    visible = false;
    shown = false;
  }

  if (dataValidated) {
    if (!visible && !shown) {
      var containerEl = document.querySelector("#container");
      if (getComputedStyle(containerEl)) {
        var newc = containerEl.cloneNode(true);
        containerEl.parentNode.replaceChild(newc, containerEl);
        $("#container").addClass("animateIn");
        $("#container").css("opacity", "1");
        visible = true;
        shown = true;
        containerCss = getComputedStyle(document.querySelector("#container"));
        if (containerCss.animationName.indexOf(',') > 0) {
          holdTimer = getAnimationDelay(containerCss, 1);
          setTimeout(function () {
            $("#container").css("opacity", "0");
            visible = false;
          }, holdTimer);
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
      console.log("previous song:", getInlineSongInfo(previous.artist, previous.title, previous.album));
      if (displayPreviousSongInfo && previousSongInfoValidated()) {
        if (first_previous) {
          setTimeout(function () {
            $("#div-previous-row").fadeIn(300);
          }, 300);
          first_previous = false;
        } else {
          $("#div-previous-prefix").fadeOut(300, function () {
            $("#div-previous-prefix").fadeIn(300);
          });
        }
        $("#div-previous-row").css("opacity", "1");
      } else {
        $("#div-previous-row").css("opacity", "0");
      }


      console.log("current song:", getInlineSongInfo(current.artist, current.title, current.album));
      hideText();
      setTimeout(updateText, 300);
      setTimeout(showText, 400);
      $("#cover").fadeOut(300, function () {
        document.getElementById("cover").src = filepaths.cover + "?t=" + current.title + current.artist;
        $("#cover").fadeIn(300);
      });
    }
  }

}

function cleanString(str) {
  return str.replace(/&/g, "&amp;").replace(/(\r\n|\n|\r)/gm, "");
}

function checkUpdate() {

  $.when(
    $.get(filepaths.title, res => current.title = cleanString(res)),
    $.get(filepaths.artist, res => current.artist = cleanString(res)),
    $.get(filepaths.album, res => current.album = cleanString(res))
  ).done(displayData);

  // $.getJSON(filepaths.info, function (data) {
  //   current = data;
  //   dataChanged = true;

  // }).fail(function () {
  //   //console.log("An error has occurred.");
  //   current = resetInfo();
  //   displayData();
  // }).then(displayData);

  setTimeout(checkUpdate, 1000);
}

function main() {
  displayPreviousSongInfo = getComputedStyle(document.querySelector("#div-previous-row")).opacity != 0 ? true : false;
  checkUpdate();
}

$(document).ready(main);