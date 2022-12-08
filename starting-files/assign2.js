/* url of song api --- https versions hopefully a little later this semester */
const api =
  "http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php";

/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/

document.addEventListener("DOMContentLoaded", function () {
  // Grabs the two loaders in the HTML file reader for use - DONE
  const loader1 = document.querySelector("#loader1 section");
  const loader2 = document.querySelector("#loader2 section");
  const loader3 = document.querySelector("#loader3 section");
  const header1 = document.querySelector("#loader1 h2");
  const header2 = document.querySelector("#loader2 h2");
  const header3 = document.querySelector("#loader3 h2");

  const alert = document.querySelector("#alert");

  /* 
    Retrive songs from API - DONE 
  */
  var songs;
  var activeSongList;
  const artists = JSON.parse(contentArtists);
  const genres = JSON.parse(contentGenres);

  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      if (retrieveStorage().length == 0) {
        songs = data;
        updateStorage();
        displaySearchView();
        console.log("not good");
      } else {
        songs = retrieveStorage();
        displaySearchView();
      }
    });

  // Local storage functions - DONE
  function updateStorage() {
    localStorage.setItem("songs", JSON.stringify(songs));
  }

  function retrieveStorage() {
    return JSON.parse(localStorage.getItem("songs")) || [];
  }

  /* 
    Buttons to switch views 
  */
  document.querySelector("#searchPage").addEventListener("click", function () {
    displaySearchView();
  });

  document.querySelector("#playlist").addEventListener("click", function () {
    displayPlaylistView();
  });

  document.querySelector("#credits").addEventListener("mouseover", function () {
    displayCredits();
  });

  /* 
    Basic Song Search Component - DONE 
  */
  function displaySearchView() {
    loader1.innerHTML = "";
    loader2.innerHTML = "";
    loader3.innerHTML = "";
    header1.textContent = "Basic Song Search";
    header2.textContent = "Browse / Search Results";
    header3.innerHTML = "";
    alert.innerHTML = "";

    createSearch();

    const titleRadio = document.querySelector("#titleI");
    const artistRadio = document.querySelector("#artistI");
    const genreRadio = document.querySelector("#genreI");

    const titleSelect = document.querySelector("#titleSelect");
    const artistSelect = document.querySelector("#artistSelect");
    const genreSelect = document.querySelector("#genreSelect");

    // Create the Basic Song Search Portion - DONE
    function createSearch() {
      createInputs("titleI", "Title", true, "titleSelect");
      createInputs("artistI", "Artist", false, "artistSelect");
      createInputs("genreI", "Genre", false, "genreSelect");

      // Creates the input field: 1) radio button 2) Label 3) Select
      function createInputs(id, ID, checked, selectID) {
        var div1 = document.createElement("div");
        div1.setAttribute("class", "row p-2");
        var div2 = document.createElement("div");
        div2.setAttribute("class", "col-sm-2");
        div2.setAttribute("style", "margin: 10px");
        var div3 = document.createElement("div");
        div3.setAttribute("class", "col-sm-4");
        var input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("name", "search");
        input.setAttribute("id", id);
        input.checked = checked;
        var label = document.createElement("label");
        label.innerHTML = ID;
        label.setAttribute("for", id);
        var select = document.createElement("select");
        select.setAttribute("id", selectID);
        select.setAttribute("style", "width:200px");

        div2.appendChild(input);
        div2.appendChild(label);
        div3.appendChild(select);
        div1.appendChild(div2);
        div1.appendChild(div3);

        loader1.appendChild(div1);
      }
      var div = document.createElement("div");
      div.setAttribute("class", "row");
      var div1 = document.createElement("div");
      div1.setAttribute("class", "col-sm-2");
      var div2 = document.createElement("div");
      div2.setAttribute("class", "col-sm-2");
      var clearButton = document.createElement("button");
      clearButton.setAttribute("id", "clearButton");
      clearButton.setAttribute("class", "btn btn-danger");
      clearButton.innerHTML = "Clear";
      div1.appendChild(clearButton);
      var filterButton = document.createElement("button");
      filterButton.setAttribute("id", "filterButton");
      filterButton.setAttribute("class", "btn btn-success");
      filterButton.innerHTML = "Filter";
      div2.appendChild(filterButton);
      div.appendChild(div1);
      div.appendChild(div2);
      loader1.appendChild(div);
    }

    // Disbales select if not chosen by the radio button - DONE
    artistSelect.disabled = true;
    genreSelect.disabled = true;

    titleRadio.addEventListener("click", function () {
      radioDisable(titleSelect);
    });
    artistRadio.addEventListener("click", function () {
      radioDisable(artistSelect);
    });
    genreRadio.addEventListener("click", function () {
      radioDisable(genreSelect);
    });

    function radioDisable(select) {
      titleSelect.disabled = true;
      artistSelect.disabled = true;
      genreSelect.disabled = true;
      select.disabled = false;
    }

    // Fill each select field with options - DONE
    songs.forEach((song) => {
      createAttribute(song.song_id, song.title, titleSelect);
    });
    artists.forEach((artist) => {
      createAttribute(artist.id, artist.name, artistSelect);
    });
    genres.forEach((genre) => {
      createAttribute(genre.id, genre.name, genreSelect);
    });

    function createAttribute(value, name, select) {
      const opt = document.createElement("option");
      opt.setAttribute("value", value);
      opt.textContent = name;
      select.appendChild(opt);
    }

    // Clears/hides the search results - DONE
    document
      .querySelector("#clearButton")
      .addEventListener("click", function () {
        displaySearchResults([], loader2);
        activeSongList = [];
      });

    // Searches for song based on the id value of the selected radio button - DONE
    document
      .querySelector("#filterButton")
      .addEventListener("click", function () {
        let filteredSongs = [];
        if (titleRadio.checked == true) {
          songs.forEach((song) => {
            if (song.song_id == titleSelect.value) {
              filteredSongs.push(song);
            }
          });
        } else if (artistRadio.checked == true) {
          songs.forEach((song) => {
            if (song.artist.id == artistSelect.value) {
              filteredSongs.push(song);
            }
          });
        } else if (genreRadio.checked == true) {
          songs.forEach((song) => {
            if (song.genre.id == genreSelect.value) {
              filteredSongs.push(song);
            }
          });
        }
        displaySearchResults(filteredSongs, loader2, "Add to Playlist");
        activeSongList = filteredSongs;
      });
  }

  // Delete current table then creates a new table that searches for the songs
  function displaySearchResults(list, loader, message, id) {
    loader.innerHTML = "";
    var div1 = document.createElement("div");
    var table = document.createElement("table");
    table.setAttribute("id", "searchTable");
    table.setAttribute(
      "class",
      "table table-striped table-light table-bordered"
    );
    div1.setAttribute("style", "overflow: auto; height: 600px;");
    div1.appendChild(table);
    loader.appendChild(div1);

    var tr1 = document.createElement("tr");
    var thead = document.createElement("thead");
    thead.setAttribute("class", "table-dark");
    createHeader("Title", "title");
    createHeader("Artist", "artist");
    createHeader("Year", "year");
    createHeader("Genre", "genre");
    createHeader("Popularity", "popularity");
    createHeader("");

    function createHeader(id, value) {
      var th = document.createElement("th");
      th.textContent = id;
      th.setAttribute("id", value);
      tr1.appendChild(th);
    }
    thead.appendChild(tr1);
    table.appendChild(thead);

    for (let song of list) {
      var tr = document.createElement("tr");
      var playlist = document.createElement("td");
      var playlistButton = document.createElement("button");
      playlistButton.setAttribute("class", "btn");
      playlistButton.textContent = message;
      playlist.appendChild(playlistButton);

      createTD(song.title);
      createTD(song.artist.name);
      createTD(song.year);
      createTD(song.genre.name);
      createTD(song.details.popularity);

      // Function that fills the table with appropriate data
      function createTD(text) {
        var td = document.createElement("td");
        td.textContent = text;
        td.setAttribute("id", text);
        tr.appendChild(td);
        // Adds listeners to each row that takes the user to the single song view
        td.addEventListener("click", function () {
          singleSong(song.song_id);
        });
      }

      tr.appendChild(playlist);
      table.appendChild(tr);

      // Adds listener to each of the button that adds the song to the playlist storage
      playlistButton.addEventListener("click", function () {
        if (retrivePlaylist().length == 0) {
          var tempList = [];
          tempList.push(song);
          updatePlaylist(tempList);

          var h1 = document.createElement("h1");
          h1.innerHTML = `${song.title} by ${song.artist.name} was added to Playlist!`;
          alert.appendChild(h1);
          setInterval(function () {
            h1.innerHTML = "";
          }, 3000);
        } else {
          var tempList = retrivePlaylist();

          // Function to find if the song exists in the playlist already
          const exists = tempList.find(function (element) {
            return element.song_id === song.song_id;
          });

          // Check for the existing song and remove from playing list if it exists
          if (exists) {
            removePlaylistSong(exists);
            if (loader == loader3) {
              displayPlaylistView();
            } else {
              var h1 = document.createElement("h1");
              h1.innerHTML = `${song.title} by ${song.artist.name} was removed from Playlist!`;
              alert.appendChild(h1);
              setInterval(function () {
                h1.innerHTML = "";
              }, 3000);
            }
          } else {
            tempList.push(song);
            updatePlaylist(tempList); // here ***********************************************************************************************************

            var h1 = document.createElement("h1");
            h1.innerHTML = `${song.title} by ${song.artist.name} was added to Playlist!`;
            alert.appendChild(h1);
            setInterval(function () {
              h1.innerHTML = "";
            }, 3000);
          }
        }
      });
      var underline = document.querySelector(`#${id}`);
      underline.setAttribute("style", "font-style: italic;");
    }

    headerEvent("title", "title", 1);
    headerEvent("artist", "artist", "name", 2);
    headerEvent("year", "year", 1);
    headerEvent("genre", "genre", "name", 2);
    headerEvent("popularity", "details", "popularity", 2);

    function headerEvent(id, value, value2, index) {
      var head = document.querySelector(`#${id}`);
      head.addEventListener("click", function () {
        var unsortedList = activeSongList;
        unsortedList.sort(function (a, b) {
          if (index > 1) {
            if (value2 == "popularity") {
              if (a[value][value2] < b[value][value2]) {
                return 1;
              }
              if (a[value][value2] > b[value][value2]) {
                return -1;
              }
            } else {
              if (a[value][value2] < b[value][value2]) {
                return -1;
              }
              if (a[value][value2] > b[value][value2]) {
                return 1;
              }
            }
          } else {
            if (a[value] < b[value]) {
              return -1;
            }
            if (a[value] > b[value]) {
              return 1;
            }
          }
        });
        displaySearchResults(unsortedList, loader, "Add to Playlist", id);
      });
    }
  }

  /* 
    Song Information and Charts Component - NOT DONE
  */
  function singleSong(songID) {
    loader1.innerHTML = "";
    loader2.innerHTML = "";
    loader3.innerHTML = "";
    header1.textContent = "Song Information";
    header2.textContent = "Radar Chart";
    header3.innerHTML = "";
    alert.innerHTML = "";

    const song = songs.find(function (element) {
      return element.song_id === songID;
    });
    const artist = artists.find(function (element) {
      return element.id === song.artist.id;
    });

    displaySongInformation();
    displayRadarChart();

    // Creates the song information component -
    function displaySongInformation() {
      // Creates the subtitle for the song
      var div1 = document.createElement("div");
      var p = document.createElement("p");
      p.textContent = `${song.title}, ${song.artist.name}, ${artist.type}, ${
        song.genre.name
      }, ${song.year}, ${Math.floor(song.details.duration / 60)}:${
        song.details.duration % 60
      }`;
      div1.appendChild(p);
      loader1.appendChild(div1);

      // Creates the statistics for the song
      var div2 = document.createElement("div");
      var h5 = document.createElement("h5");
      h5.textContent = "Analysis data:";
      div2.appendChild(h5);

      var ul = document.createElement("ul");
      createLi(`${song.details.bpm}`, "bpm");
      createLi(`${song.analytics.energy}`, "energy");
      createLi(`${song.analytics.danceability}`, "danceability");
      createLi(`${song.analytics.liveness}`, "liveness");
      createLi(`${song.analytics.valence}`, "valence");
      createLi(`${song.analytics.acousticness}`, "acousticness");
      createLi(`${song.analytics.speechiness}`, "speechiness");
      createLi(`${song.details.popularity}`, "popularity");
      div2.appendChild(ul);
      loader1.appendChild(div2);

      // Creates the list the appends to the ul
      function createLi(name, label) {
        var li = document.createElement("li");
        li.textContent = label + ": " + name;
        ul.appendChild(li);
      }
    }

    // Creates the radar chart component -
    function displayRadarChart() {
      var div = document.createElement("div");
      var canvas = document.createElement("canvas");
      canvas.setAttribute("id", "ctx");
      canvas.setAttribute("style", "max-width: 600px; max-height: 600px");
      div.appendChild(canvas);
      loader2.appendChild(div);
      // https://www.chartjs.org/docs/latest/charts/radar.html
      const data = {
        labels: [
          "Danceability",
          "Energy",
          "Speechiness",
          "Acousticness",
          "Liveness",
          "Valence",
        ],
        datasets: [
          {
            label: `${song.title} - ${song.artist.name}`,
            data: [
              song.analytics.danceability,
              song.analytics.energy,
              song.analytics.speechiness,
              song.analytics.acousticness,
              song.analytics.liveness,
              song.analytics.valence,
            ],
            fill: true,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)",
            pointBackgroundColor: "rgb(255, 99, 132)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(255, 99, 132)",
          },
        ],
      };
      const chart = new Chart(ctx, {
        type: "radar",
        data: data,
        options: {
          elements: {
            line: {
              borderWidth: 4,
            },
          },
        },
      });
    }
  }

  /*
    Playlist Component - NOT DONE
  */
  function displayPlaylistView() {
    loader1.innerHTML = "";
    loader2.innerHTML = "";
    header1.innerHTML = "";
    header2.innerHTML = "";
    header3.textContent = "My Playlist";
    var tempList = retrivePlaylist();
    if (tempList.length > 0) {
      displaySearchResults(tempList, loader3, "Remove from Playlist");
    } else {
      alert.innerHTML = "";
      loader3.innerHTML = "";
      var h1 = document.createElement("h1");
      h1.textContent = "Your Playlist is Empty";
      alert.appendChild(h1);
    }
  }

  // update storage with revised collection
  function updatePlaylist(playlist) {
    sessionStorage.setItem("playlist", JSON.stringify(playlist));
  }

  // retrieve from storage or return empty array if doesn't exist
  function retrivePlaylist() {
    return JSON.parse(sessionStorage.getItem("playlist")) || [];
  }

  // removes collection from storage
  function removePlaylistSong(target) {
    var tempList = retrivePlaylist();
    var newList = tempList.filter((song) => {
      return song.song_id !== target.song_id;
    });
    console.log(newList);
    updatePlaylist(newList);
  }

  /* 
    Displays credit pop-up
  */
  function displayCredits() {
    var divCredit = document.querySelector("#divCredit");
    var p = document.createElement("p");
    var a = document.createElement("a");
    a.setAttribute(
      "href",
      "https://github.com/PeterMNguyenMRU/Assignment2_web2"
    );
    a.textContent = "Github Page";
    p.textContent = "Peter Nguyen";
    divCredit.appendChild(p);
    divCredit.appendChild(a);
    setTimeout(function () {
      divCredit.innerHTML = "";
    }, 5000);
  }
});
