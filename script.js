console.log("hii Iam Rasool")

let currentsong = new Audio();
let songs;
let curFolder;

function secondsToMinutes(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(folder) {
    curFolder = folder;
    let s = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await s.text()
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 1; index < as.length; index++) {
        const element = as[index];
        songs.push(element.href.split(`/${folder}/`)[1])
    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = "";
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><div class="songsu">
        <img src="music.svg" alt="">
        <div class="songinfo">
            <div>${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="play">
          <img src="play.svg" alt="">
        </div>
      </div> </li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".songinfo").firstElementChild.innerHTML)
            playmusic(e.querySelector(".songinfo").firstElementChild.innerHTML)
        })
    })

}

const playmusic = (track,pause=false) =>{
    currentsong.src = `/${curFolder}/` + track;
    if(!pause){
        currentsong.play();
        play.src = "pause.svg"
    }
  
    document.querySelector(".songname").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    await getsongs("songs/ncs");
    playmusic(songs[0],true);
    // console.log(songs)

     play.addEventListener("click" , ()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src = "pause.svg"
        }
        else{
            currentsong.pause()
            play.src = "play.svg"
        }
    })
    previous.addEventListener("click", ()=>{
        console.log(currentsong)
    })

    currentsong.addEventListener("timeupdate", ()=>{
        // console.log(currentsong.currentTime , currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentsong.currentTime)}/ ${secondsToMinutes(currentsong.duration)}`

        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) *100 +"%";
    })

    document.querySelector(".line").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) *100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) /100
    })

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click" , ()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        if((index-1) >=0){
            playmusic(songs[index-1])
        }
    })
    next.addEventListener("click", ()=>{
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0]);
        if((index-1) < songs.length){
            playmusic(songs[index+1])
        }
    })
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentsong.volume = parseInt(e.target.value)/100
    })
    
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            console.log(item, item.target.dataset)
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}
main()




