//   ___        _   _       _    _            _     __ _               
//  / _ \      | | | |     | |  | |          | |   / _| |              
// / /_\ \_   _| |_| |__   | |  | | ___  _ __| | _| |_| | _____      __
// |  _  | | | | __| '_ \  | |/\| |/ _ \| '__| |/ /  _| |/ _ \ \ /\ / /
// | | | | |_| | |_| | | | \  /\  / (_) | |  |   <| | | | (_) \ V  V / 
// \_| |_/\__,_|\__|_| |_|  \/  \/ \___/|_|  |_|\_\_| |_|\___/ \_/\_/ 

const clientId = "1d98040514504aa997355f00e646a054";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
var accessToken = ""

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    accessToken = await getAccessToken(clientId, code);
}

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-email user-library-read user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

getUserPlaylists();

// ______   _       _     _                  _____                 _  __ _          ______      _        
// |  ___| | |     | |   (_)                /  ___|               (_)/ _(_)         |  _  \    | |       
// | |_ ___| |_ ___| |__  _ _ __   __ _     \ `--.  ___ _ __   ___ _| |_ _  ___     | | | |__ _| |_ __ _ 
// |  _/ _ \ __/ __| '_ \| | '_ \ / _` |     `--. \/ _ \ '_ \ / __| |  _| |/ __|    | | | / _` | __/ _` |
// | ||  __/ || (__| | | | | | | | (_| |    /\__/ /  __/ |_) | (__| | | | | (__     | |/ / (_| | || (_| |
// \_| \___|\__\___|_| |_|_|_| |_|\__, |    \____/ \___| .__/ \___|_|_| |_|\___|    |___/ \__,_|\__\__,_|
//                                 __/ |               | |                                               
//                                |___/                |_|                                               

async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function fetchInfo(token, type, trackURI){
    const result = await fetch(`https://api.spotify.com/v1/${type}/${trackURI}`, {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });
    return await result.json();
}

async function fetchArtist(token, artistURI){
    const result = await fetch(`https://api.spotify.com/v1/artists/${artistURI}`, {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });
    return await result.json();
}

async function fetchRecommendations(token, genre, seedTrack, danceIn, energy){
    const result = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${genre}&seed_tracks=${seedTrack}&target_danceability=${danceIn}&target_energy=${energy}`, {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });
    return await result.json();
}

async function fetchClassical(token, genre, happiness, mode){
    const result = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${genre}&target_happiness=${happiness}&target_mode=${mode}`, {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });
    return await result.json();
}

async function fetchRecs(token, seedTrack){
    const result = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${seedTrack}`, {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });
    return await result.json();
}

//gets all of your liked songs
async function getLikedTracks(token){
    const result = await fetch(`https://api.spotify.com/v1/me/tracks?limit=50`, {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });
    return await result.json();
}

//get the users top tracks
async function getTopTracks(token, timeRange, limit){
    const result = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`, {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });
    return await result.json();
}

//get the users playlists
async function getPlaylists(token){
    const result = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });
    return await result.json();
}

async function getTracksOnPlaylist(token, id){
    const result = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });
    return await result.json();
}

async function getSearchedAlbums(token, artistName){
    const result = await fetch(`https://api.spotify.com/v1/search?q=artist%3A${artistName}&type=album`, {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });
    return await result.json();
}


//  _______   ______   ____    __    ____ .__   __.  __        ______        ___       _______          ___       __      .______    __    __  .___  ___.      ______   ______   ____    ____  _______ .______          _______.
// |       \ /  __  \  \   \  /  \  /   / |  \ |  | |  |      /  __  \      /   \     |       \        /   \     |  |     |   _  \  |  |  |  | |   \/   |     /      | /  __  \  \   \  /   / |   ____||   _  \        /       |
// |  .--.  |  |  |  |  \   \/    \/   /  |   \|  | |  |     |  |  |  |    /  ^  \    |  .--.  |      /  ^  \    |  |     |  |_)  | |  |  |  | |  \  /  |    |  ,----'|  |  |  |  \   \/   /  |  |__   |  |_)  |      |   (----`
// |  |  |  |  |  |  |   \            /   |  . `  | |  |     |  |  |  |   /  /_\  \   |  |  |  |     /  /_\  \   |  |     |   _  <  |  |  |  | |  |\/|  |    |  |     |  |  |  |   \      /   |   __|  |      /        \   \    
// |  '--'  |  `--'  |    \    /\    /    |  |\   | |  `----.|  `--'  |  /  _____  \  |  '--'  |    /  _____  \  |  `----.|  |_)  | |  `--'  | |  |  |  |    |  `----.|  `--'  |    \    /    |  |____ |  |\  \----.----)   |   
// |_______/ \______/      \__/  \__/     |__| \__| |_______| \______/  /__/     \__\ |_______/    /__/     \__\ |_______||______/   \______/  |__|  |__|     \______| \______/      \__/     |_______|| _| `._____|_______/    
                                                                                                                                                                                                                            

const btn = document.getElementById('downloadImage');
const container = document.getElementById("container");
var urlArray = []
var searchArray = []
var searchNameArray = []
var nameArray = []
var playlistArray = {};

async function getUserPlaylists(){
    const playlists = await getPlaylists(accessToken);

    for(let i = 0; i < playlists.items.length; i++){
        let playlistName = playlists.items[i].name
        playlistArray[playlistName] = playlists.items[i].id;
        let newOption = new Option(playlistName, playlistName);
        const playlistSelect = document.getElementById('playlistName'); 
        playlistSelect.add(newOption, undefined);
    }
}

//GET COVERS BASED ON BUTTONS
//get liked songs
document.getElementById("likedSongs").addEventListener("click", async () => {
    const tracks = await getLikedTracks(accessToken);

    getCovers(tracks)
    generateCovers();
})

//get top songs
document.getElementById("topSongs").addEventListener("click", async () => {
    var topType = document.getElementById("topType").value
    var numSongs = document.getElementById("numSongs").value

    var tracks;

    if(numSongs == ""){
        tracks = await getTopTracks(accessToken, topType, 21)
    } else{
        tracks = await getTopTracks(accessToken, topType, numSongs)
    }

    getTopCovers(tracks);
    generateCovers();
})

//get songs on playlist
document.getElementById("fromPlaylist").addEventListener("click", async () => {
    var playlistName = document.getElementById('playlistName').value;
    const tracks = await getTracksOnPlaylist(accessToken, playlistArray[playlistName])

    getCovers(tracks)
    generateCovers();
})

//HELPER FUNCTIONS
//helper functions that parse the json data returned by the API calls and display the covers————————————————————————————————————————————
function getCovers(tracks){
    urlArray = []
    nameArray = []
    for(let i = 0; i < tracks.items.length; i++){
        urlArray.push(tracks.items[i].track.album.images[0].url);
        nameArray.push(tracks.items[i].track.album.name)
        console.log(nameArray[i])
        console.log(urlArray[i])
    }

    var r = document.querySelector(':root');
    r.style.setProperty('--numColumns', Math.ceil(urlArray.length / 3));
}

function getTopCovers(tracks){
    urlArray = []
    nameArray = []
    for(let i = 0; i < tracks.items.length; i++){
        urlArray.push(tracks.items[i].album.images[0].url);
        nameArray.push(tracks.items[i].album.name)
    }
    var r = document.querySelector(':root');
    r.style.setProperty('--numColumns', Math.ceil(urlArray.length / 3));
}

function displayCovers(){
    container.innerHTML = "";
    for(let i = 0; i < urlArray.length; i++){
        $(".container").append("<img class='cover' title='" + nameArray[i] + "' id='" + i + "' draggable='true' src='" + urlArray[i] + "'>")
    }
}

function generateCovers(){
    container.style.gridTemplateColumns = "repeat(auto-fit, minmax(10vw, 1fr))";

    displayCovers();

    const gridComputedStyle = window.getComputedStyle(container);
    const gridColumnCount = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;
    console.log(gridColumnCount)
    var r = document.querySelector(':root');
    r.style.setProperty('--numColumns', gridColumnCount);
    container.style.gridTemplateColumns = "repeat(var(--numColumns), 1fr)";
}

//Code to create your own collage from scratch
document.getElementById("createGrid").addEventListener("click", () => {
    var rows = document.getElementById("rows").value;
    var cols = document.getElementById("cols").value;
    var r = document.querySelector(':root');
    r.style.setProperty('--numColumns', cols);
    addDivs(rows, cols);
})

function addDivs(rows, cols){
    urlArray = [];
    nameArray = [];
    for(let i = 0; i < rows * cols; i++){
        nameArray.push("------")
        urlArray.push("images/whiteSquare.jpeg")
    }
    displayCovers();
}

//Code to add or subtract columns————————————————————————————————————————————

document.getElementById("addColumn").addEventListener("click", () => {
    var r = document.querySelector(':root');
    var numColumns = getComputedStyle(r).getPropertyValue('--numColumns')
    numColumns++;
    r.style.setProperty('--numColumns', numColumns);
})

document.getElementById("subColumn").addEventListener("click", () => {
    var r = document.querySelector(':root');
    var numColumns = getComputedStyle(r).getPropertyValue('--numColumns')
    numColumns--;
    r.style.setProperty('--numColumns', numColumns);
})

//Code to shuffle covers————————————————————————————————————————————
document.getElementById("shuffleCovers").addEventListener("click", () => {
    shuffleCovers(urlArray);
    displayCovers(urlArray);
})

function shuffleCovers(arr){
    for(let i = 0; i < arr.length; i++){
        var swapIndex = i + (Math.floor(Math.random() * (arr.length - i)));
        swapCovers(arr, i, swapIndex);
    }
}

function swapCovers(arr, a, b){
    var helper = arr[a];
    arr[a] = arr[b];
    arr[b] = helper;
}

//Code to change the spacing between covers————————————————————————————————————————————

document.getElementById("spacingSlider").addEventListener("input", () => {
    var r = document.querySelector(':root');
    var gridGap = getComputedStyle(r).getPropertyValue('--gridGap')
    gridGap = (document.getElementById("spacingSlider").value / 4) + "vw";
    r.style.setProperty('--gridGap', gridGap);
})

//Code to download the images—————————————————————————————————————————————————————

import JSZip from "jszip";
import axios from "axios";
import { saveAs } from "file-saver";

const zip = new JSZip();

const fileArr = [];

const download = (item) => {
    //download single file as blob and add it to zip archive
    return axios.get(item.url, { responseType: "blob" }).then((resp) => {
        zip.file(item.name, resp.data);
    });
};

//call this function to download all files as ZIP archive
const downloadAll = () => {

    for(let i = 0; i < urlArray.length; i++){
        console.log(nameArray[i])
        if(nameArray[i] != "------"){
            var coverData = {name: nameArray[i] + ".jpeg", url: urlArray[i]}
            fileArr.push(coverData)
        }
    }

    const arrOfFiles = fileArr.map((item) => download(item)); //create array of promises
    Promise.all(arrOfFiles)
        .then(() => {
            //when all promises resolved - save zip file
            zip.generateAsync({ type: "blob" }).then(function (blob) {
                saveAs(blob, "collage.zip");
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

btn.addEventListener('click', (event) => {
    event.preventDefault();
    downloadAll();
})

//MODAL STUFF————————————————————————————————————————————————
const modal = document.getElementById("modal");
const searchBox = document.getElementById("searchBox");
const closeModal = document.getElementById("close");
var chosenDisplayId;
var searchedImage;
var searchedName;

closeModal.addEventListener("click", () => {
    modal.close();
})

//gets the searched album image and name from the returned json
function getArtistsAlbums(artistAlbums){
    searchArray = []
    for(let i = 0; i < artistAlbums.albums.items.length; i++){
        searchArray.push(artistAlbums.albums.items[i].images[0].url);
        searchNameArray.push(artistAlbums.albums.items[i].name)
    }
}

function generateSearchedCovers(){
    $(".searchGrid")[0].innerHTML = "";
    for(let i = 0; i < searchArray.length; i++){
        $(".searchGrid").append("<img class='searchCover' id='s" + i + "' title='" + searchNameArray[i] + "' draggable='true' src='" + searchArray[i] + "'>")
    }
}

//generates the searched albums and sends them to getArtistsAlbums and generates the covers
searchBox.addEventListener("change", async () => {
    let artistName = searchBox.value;
    const artistAlbums = await getSearchedAlbums(accessToken, artistName);
    getArtistsAlbums(artistAlbums);
    generateSearchedCovers();
})

//when you click on a cover it opens up the modal and finds the id of the element
$(document).on('click', '.cover', function() {
    chosenDisplayId = $(this).attr("id");
    modal.showModal();
})

//when you click on a searched cover it sets the actual cover to the image on the searched cover
$(document).on('click', '.searchCover', function() {
    searchedImage = $(this).attr("src"); //the src for the clicked search image
    searchedName = $(this).attr("title"); //the name for the clicked search image
    document.getElementById(chosenDisplayId).src = searchedImage; //the src of the actual clicked cover is set to the searched image
    document.getElementById(chosenDisplayId).title = searchedName;
    urlArray[chosenDisplayId] = searchedImage;
    nameArray[chosenDisplayId]= searchedName;
})