var conf = {};

var current = {};
current.title = "";
current.artist = "";
current.album = "";
current.duration = 0;
current.progress = 0;
current.time_left = 0;

var previous = {};
previous.title = "";
previous.artist = "";
previous.album = "";

var dataValidated = false;
var dataChanged = false;
var visible = false;
var shown = false;
var displayPreviousSongInfo = false;
var displayProgress = false;
var displayDuration = false;
var round_borders = false;
var border_radius = "0px";

var first_previous = true;

function truncate(str, n) {
  "use strict";
  var subString = "";
  if (str.length > n) {
    subString = str.substr(0, n - 1);
    subString = subString.substr(0, subString.lastIndexOf(" "));
    str = (subString.endsWith(",")) ? subString.substr(0, subString.lastIndexOf(",")) + ' ...' : subString + ' ...';
  }
  return str;
}

function getInlineSongInfo(artist, title, album) {
  if (!album) {
    return artist + " – " + title;
  }
  return artist + " – " + title + " [" + album + "]";
}

function previousSongInfoValidated() {
  return !(previous.artist.length == 0 || previous.title.length == 0 || previous.album.length == 0);
}

function updateInfo() {
  document.getElementById("cover").src = current.cover + "?t=" + current.title + current.artist;
  $("#title").text(current.title);
  $("#artist").text(current.artist);
  $("#album").text(current.album);
  if (displayDuration) {
    $("#duration-total").text(millisToMinutesAndSeconds(current.duration));
  }
  if (previousSongInfoValidated()) {
    $("#previous").text(getInlineSongInfo(truncate(previous.artist, conf.songinfo.maxLength.previous), truncate(previous.title, conf.songinfo.maxLength.previous)));
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
      }, conf.songinfo.scrollingDelay);
    } else {
      elem.removeClass("scrolling");
    }
    // elem.fadeIn(500).promise().done(function () {
    //   elem.css("opacity", "1");
    // });
  });
}

function showText() {
  animateText($("#title"), current.title, conf.songinfo.maxLength.title);
  animateText($("#artist"), current.artist, conf.songinfo.maxLength.artist);
  animateText($("#album"), current.album, conf.songinfo.maxLength.album);
  animateText($("#previous"), getInlineSongInfo(previous.artist, previous.title, previous.album), conf.songinfo.maxLength.previous);
}

function updateProgress() {
  var current_progress = current.progress / current.duration * 100;
  document.getElementById("div-bar").style.width = current_progress + "%";
  if (displayDuration) {
    $("#duration-current").text(millisToMinutesAndSeconds(current.progress));
  }
}

function showProgressBar() {
  var progress = $("#div-progress");
  progress.fadeIn(1000).promise().done(function () {
    progress.css("opacity", "1");
  });
}

function fadeOutInElems() {
  $("#div-cover")
    .add($("#div-title"))
    .add($("#div-artist"))
    .add($("#div-album"))
    .add($("#div-duration"))
    // .add($("#div-previous-row"))
    .fadeOut(300, updateInfo)
    .fadeIn(300);
}

function fadeInElems() {
  $("#div-cover")
    .add($("#div-title"))
    .add($("#div-artist"))
    .add($("#div-album"))
    .add($("#div-duration"))
    // .add($("#div-previous-row"))
    .fadeOut(300, updateInfo)
    .fadeIn(300);
}

// https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (seconds == 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
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

  if (current.title != $("#title").text() || current.artist != $("#artist").text() || current.album != $("#album").text()) {
    previous.title = $("#title").text();
    previous.artist = $("#artist").text();
    previous.album = $("#album").text();
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
      if ($("#div-previous-row").length) {
        if (displayPreviousSongInfo && previousSongInfoValidated()) {
          if (first_previous) {
            if (round_borders) {
              var top = border_radius + " " + border_radius + " 0px 0px";
              var bot = "0px 0px " + " " + border_radius + " " + border_radius;
              if ($("#div-previous-row").css("order") == 1) {
                $("#div-current").css("border-radius", top);
                $("#div-previous-row").css("border-radius", bot);
              } else {
                $("#div-current").css("border-radius", bot);
                $("#div-previous-row").css("border-radius", top);
              }
            }
            $("#div-previous-row").fadeIn(300);
            first_previous = false;
            $("#div-previous-row").css("opacity", "1");
          }
        } else {
          $("#div-previous-row").css("opacity", "0");
        }
      }
      updateInfo();
      showText();
      // fadeInElems();
      // hideText();
      // setTimeout(updateText, 300);
      // setTimeout(showText, 400);
      // $("#cover")
      //   .fadeOut(300, function () {
      //     document.getElementById("cover").src = current.cover + "?t=" + current.title + current.artist;
      //   })
      //   .fadeIn(300);
      if (displayProgress) {
        setTimeout(showProgressBar, 400);
      }
    }
    if (displayProgress) {
      updateProgress();
    }
  }

}

function cleanString(str) {
  return str.replace(/(\r\n|\n|\r)/gm, "");
}

function checkUpdate() {
  if (conf.loadInfoFromServer) {
    fetch(conf.tunaServerAddr)
      .then(response => response.json())
      .then(data => {
        current.artist = '';
        current.title = '';
        current.album = '';
        current.duration = 0;
        current.progress = 0;
        //current.time_left = 0;
        current.cover = '';
        if (data['status'] == 'playing') {
          for (var i = 0; i < data['artists'].length; i++) {
            current.artist += data['artists'][i];
            if (i < data['artists'].length - 1)
              current.artist += ', ';
          }
          current.artist = cleanString(current.artist);

          current.title = cleanString(data['title']);
          current.album = cleanString(data['album']);

          current.duration = data['duration'];
          current.progress = data['progress'];
          //current.time_left = data['time_left'];
          current.cover = data['cover_url'];
        }
      })
      .then(displayData)
      .catch(function () {
        console.log(`An error has occurred. Check if Tuna is running and serving json on ${conf.tunaServerAddr}`);
      })
  } else {
    $.when(
        $.get(conf.filepaths.title, res => current.title = cleanString(res)),
        $.get(conf.filepaths.artist, res => current.artist = cleanString(res)),
        $.get(conf.filepaths.album, res => current.album = cleanString(res)),
        $.get(conf.filepaths.cover, res => current.cover = cleanString(res)))
      .done(displayData);
  }

  setTimeout(checkUpdate, conf.updateRefreshRate);
}

function main() {
  $.getJSON('./config.json', function (response) {
    conf = response;
  }).fail(function () {
    console.log("An error has occurred while loading config.json file.");
  }).then(function () {
    displayPreviousSongInfo = getComputedStyle(document.querySelector("#div-previous-row")).display == 'none' ? false : true;
    displayProgress = getComputedStyle(document.querySelector("#div-progress")).display == 'none' ? false : true;
    displayDuration = getComputedStyle(document.querySelector("#div-duration-row")).display == 'none' ? false : true;
    round_borders = getComputedStyle(document.querySelector("#div-current")).borderRadius == '0px' ? false : true;
    if (round_borders) {
      border_radius = getComputedStyle(document.querySelector("#div-current")).borderRadius;
      console.log("border_radius", border_radius)
    }

    checkUpdate();
  });
}

$(document).ready(main);