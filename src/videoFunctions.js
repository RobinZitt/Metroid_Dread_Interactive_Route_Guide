import {updateGuideView} from './App';
import {completeRoute} from "./loadRoute";
import {useRef} from "react";

export let videoCounter = 0;
const videosFolderName = "./Videos/";
export let video;
export let video2;


export function VideoPlayer(){
    return (
        <>
            <video
                ref={video}
                src=""
                className="videos"
                id="Videos"
                style={{display: "none"}}
                onEnded={()=>nextVideo(true)}
                onTimeUpdate={updateSlider}
                onResize={videoResize}
            >
            </video>
            <video
                ref={video2}
                src=""
                className="videos"
                id="Videos2"
                style={{display: "none"}}
                onEnded={()=>nextVideo(false)}
                onTimeUpdate={updateSlider}
                onResize={videoResize}
            >

            </video>
        </>
    );
}

export function InitVideoRefs(){
    video = useRef(null);
    video2 = useRef(null);

}

export function resetVideoCounter() {
    videoCounter = 0;
}

//Show the next video in the array. Is usually called after the last video ended
export function nextVideo(isVideo1 = (video.current.style.display === "block"),autoplay=true){
    if (videoCounter >= completeRoute.length -1) return;
    videoCounter++;
    updateGuideView(isVideo1,autoplay,false);
}

//Show the previous video
export function previousVideo(isVideo1=(video.current.style.display === "block"),autoplay=true,playFromEnd=false){
    if (videoCounter < 1) return;
    videoCounter--;
    updateGuideView(isVideo1,autoplay,playFromEnd);
}

//Shows the current video and hides the other one. Loads the next video in the background if possible
export function changeVideo(isVideo1,autoPlay,playFromEnd=false){//get isVideo1 from blocked?
    let currentVideo = isVideo1 ? video.current : video2.current;
    let nextVideo = isVideo1 ? video2.current : video.current;
    currentVideo.pause();
    currentVideo.style.display = "none";
    nextVideo.style.display = "block";
    let folder = completeRoute[videoCounter].split("_")[0]+"/";
    if (nextVideo.getAttribute("src") !== videosFolderName+folder+completeRoute[videoCounter]+".mp4"){
        let source = videosFolderName+folder+completeRoute[videoCounter]+".mp4";
        nextVideo.setAttribute("src",source);
        nextVideo.load();
        nextVideo.onloadedmetadata = () => {
            if (nextVideo.duration > 5 && playFromEnd)
                nextVideo.currentTime = nextVideo.duration - 5;
            playFromEnd = false;
        };
    }
    if (autoPlay) nextVideo.play();
    if (videoCounter < completeRoute.length - 1){
        let nextFolder = completeRoute[videoCounter+1].split("_")[0]+"/";
        currentVideo.setAttribute("src", videosFolderName+nextFolder+completeRoute[videoCounter+1]+".mp4");
        currentVideo.load();
        currentVideo.style.display="none";
    }
    let videoControls = document.getElementById("videoControls");
    if (document.fullscreenElement === null){
        videoControls.style.left = (nextVideo.style.left + nextVideo.offsetWidth/2 - videoControls.offsetWidth/2) + "px";
    }
    else{
        videoControls.style.left = (window.outerWidth/2 - videoControls.offsetWidth/2) + "px";
    }
}

export function playPause(){
    let isVideo1=(video.current.style.display === "block");
    let currentVideo = isVideo1 ? video.current : video2.current;
    console.log(currentVideo.paused)
    if (currentVideo.paused) currentVideo.play();
    else currentVideo.pause();
}

export function fullscreen(){
    if (document.fullscreenElement === null)
        document.getElementById("vCon").requestFullscreen();
    else
        document.exitFullscreen();
}
export function fullscreenChanger() {
    let videoContainer = document.getElementById("vCon");
    let videoControls = document.getElementById("videoControls");
    let isVideo1=(video.current.style.display === "block")
    let currentVideo = isVideo1 ? video.current : video2.current;
    if (videoContainer === document.fullscreenElement){
        video.current.style.width = "100%";
        video2.current.style.width = "100%";
        videoControls.style.left = (window.outerWidth/2 - videoControls.offsetWidth/2) + "px";
    }
    else {
        video.current.style.removeProperty("width");
        video2.current.style.removeProperty("width");
        videoControls.style.left = (currentVideo.style.left + currentVideo.offsetWidth/2 - videoControls.offsetWidth/2) + "px";
    }
    if (document.fullscreenElement === video.current){
        document.exitFullscreen();
    }
    if (document.fullscreenElement === video2.current){
        document.exitFullscreen();
    }
}

export function progressBar(){
    let videoProgress = document.getElementById("videoSlider").value;
    let isVideo1=(video.current.style.display === "block")
    let currentVideo = isVideo1 ? video.current : video2.current;
    currentVideo.currentTime = currentVideo.duration * (videoProgress/100);
}

export function updateSlider(){
    let isVideo1=(video.current.style.display === "block")
    let currentVideo = isVideo1 ? video.current : video2.current;
    if (currentVideo.currentTime === 0)
        document.getElementById("videoSlider").value = 0;
    else
        document.getElementById("videoSlider").value = (currentVideo.currentTime / currentVideo.duration)*100;
}

export function videoResize(){
    let videoContainer = document.getElementById("vCon");
    let videoControls = document.getElementById("videoControls");
    let isVideo1=(video.current.style.display === "block")
    let currentVideo = isVideo1 ? video.current : video2.current;
    if (videoContainer === document.fullscreenElement){
        videoControls.style.left = (window.outerWidth/2 - videoControls.offsetWidth/2) + "px";
    }
    else {
        videoControls.style.left = (currentVideo.style.left + currentVideo.offsetWidth/2 - videoControls.offsetWidth/2) + "px";
    }
}
export function changeVolume(){
    video.current.volume = document.getElementById("volumeSlider").value;
    video2.current.volume = document.getElementById("volumeSlider").value;
}
