
//profile info
document.getElementById("genProfileData").addEventListener("click", async () => {
    console.log(accessToken)
    const profile = await fetchProfile(accessToken);
    console.log(profile)
    populateUI(profile);
})

//populates profile information
function populateUI(profile, track) {
    document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar").appendChild(profileImage);
        document.getElementById("imgUrl").innerText = profile.images[0].url;
    }
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").innerText = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);
}

//find track and audio features when a spotify URI is inputted into the input box
document.getElementById("uriInput").addEventListener("change", async () => {
    var trackURI = document.getElementById("uriInput").value
    const track = await fetchInfo(accessToken, "tracks", trackURI.slice(14));
    $('#songs').data('uri', trackURI.slice(14))
    console.log(track)
    document.getElementById("trackName").innerText = track.name
    const audio = await fetchInfo(accessToken, "audio-features", trackURI.slice(14))
    console.log(audio)
    const artist = await fetchArtist(accessToken, track.artists[0].id)
    console.log(artist.genres[0])
    $('#songs').data('genre', artist.genres[0]);
    document.getElementById("Danceability").innerText = audio.danceability
    document.getElementById("Energy").innerText = audio.energy
    if(audio.mode == 1){
        document.getElementById("mode").innerText = "Major"
    } else{
        document.getElementById("mode").innerText = "Minor"
    }
    document.getElementById("Happiness").innerText = audio.valence
    document.getElementById("tempo").innerText = audio.tempo
})

//generate recommendations when the generate recommendations button is pressed
document.getElementById("genRecs").addEventListener("click", async () => {
    // var seedTrack = document.getElementById("uriInput2").value.slice(14)
    var seedTrack = $('#songs').data('uri');
    var danceIn = Math.abs(document.getElementById("danceIn").value - 0.5)
    var energyIn = Math.abs(document.getElementById("energyIn").value - 0.5)
    var happinessIn = document.getElementById("happinessIn").value
    // var genre = document.getElementById("genreIn").value
    var genre = $('#songs').data('genre');
    // const recs = await fetchRecommendations(accessToken, genre, seedTrack, danceIn, energyIn)
    const recs = await fetchClassical(accessToken, "classical", happinessIn, 1);
    var recTracks = recs.tracks
    for(let i = 0; i < recTracks.length; i++){
        console.log(recTracks[i].name)
    }
})

var uriIn = document.getElementById("uriIn");
var recOut = document.getElementById("recOut");

uriIn.addEventListener("change", async () => {
    var seedTrack = uriIn.value.slice(14);
    const recs = await fetchRecs(accessToken, seedTrack);
    console.log(recs)
    var recTracks = ""
    for(let i = 0; i < recs.tracks.length; i++){
        recTracks += (recs.tracks[i].name + " by " + recs.tracks[i].artists[0].name + ", ")
    }
    const track = await fetchInfo(accessToken, "tracks", seedTrack);
    const artist = await fetchArtist(accessToken, track.artists[0].id)
    document.getElementById("genreOut").innerHTML = artist.genres[0]
    recOut.innerHTML = recTracks;
})
