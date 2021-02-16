loadInfoFromServer = true;
tunaServerAddr = 'http://localhost:1608';
updateRefreshRate = 500;

var filepaths = {};
filepaths.artist = "./data/np_artist.txt";
filepaths.album = "./data/np_album.txt";
filepaths.title = "./data/np_title.txt";
filepaths.cover = "./data/np_cover.png";

var scrollingDelay = 1500;


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


var maxLength = {};
maxLength.title = 30;
maxLength.artist = 35;
maxLength.album = 50;
maxLength.previous = 38;

var first_previous = true;

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
  $("#title").text(current.title);
  $("#artist").text(current.artist);
  $("#album").text(current.album);
  if (previousSongInfoValidated()) {
    $("#previous").text(getInlineSongInfo(truncate(previous.artist, maxLength.previous), truncate(previous.title, maxLength.previous)));
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

  if (current.title != $("#title").text() || current.artist != $("#artist").text() || current.album != $("#album").text()) {
    previous.title = $("#title").text();
    previous.artist = $("#artist").text();
    previous.album = $("#album").text();
    // console.log(current.album, " vs ", previous.album);
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
      // console.log("previous song:", getInlineSongInfo(previous.artist, previous.title, previous.album));
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


      // console.log("current song:", getInlineSongInfo(current.artist, current.title, current.album));
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
  if (loadInfoFromServer) {
    fetch(tunaServerAddr)
      .then(response => response.json())
      .then(data => {
        current.artist = '';
        current.title = '';
        current.album = '';
        if (data['status'] == 'playing') {
          var array = data['artists'];
          for (var i = 0; i < array.length; i++) {
            current.artist += array[i];
            if (i < array.length - 1)
              current.artist += ', ';
          }
          current.artist = cleanString(current.artist);

          current.title = cleanString(data['title']);
          current.album = cleanString(data['album']);
          // console.log(data['album'], "cleaned to:", current.album);
        }
      })
      .then(displayData)
      .catch(function () {
        console.log(`An error has occurred. Check if Tuna is running and serving json on ${tunaServerAddr}`);
      })
  } else {
    $.when(
        $.get(filepaths.title, res => current.title = cleanString(res)),
        $.get(filepaths.artist, res => current.artist = cleanString(res)),
        $.get(filepaths.album, res => current.album = cleanString(res)))
      .done(displayData);
  }
  // $.getJSON(filepaths.info, function (data) {
  //   current = data;
  //   dataChanged = true;

  // }).fail(function () {
  //   //console.log("An error has occurred.");
  //   current = resetInfo();
  //   displayData();
  // }).then(displayData);

  setTimeout(checkUpdate, updateRefreshRate);
}

function main() {
  displayPreviousSongInfo = getComputedStyle(document.querySelector("#div-previous-row")).opacity != 0 ? true : false;
  checkUpdate();
}

$(document).ready(main);