import {videoCounter} from "./videoFunctions";
import {completeLoadoutData} from "./loadoutFunctions";
import {updateGuideView} from "./App";
import React, {useRef} from "react";
import './App.css';
import {arrowOrderedData} from "./loadRoute";


export let mapOpen = false;
const mapsFolderName = "./Maps/";
let mapSizeRatio = 1;
let zoomLevel = "fullZoom";
let arrowDisplayStyle = "upgrade";
const mapHeight = "520px";
export let image;

//Loads in the image of the map
export function changeMap(){
    image.current.setAttribute("src", mapsFolderName+"artaria.png");//TODO adjust region
    image.current.onload = function() { zoom() };
}


export function updateZoom(newZoom){
    zoomLevel = newZoom;
    zoom();
}

export function ShowMap(){
    image = useRef(null);
    return (
        <div style={{display: "none"}} id="imageContainer" className="imageContainer">
            <div id="mapContainer" className="step">
                <div className="mapContainer">
                    <img ref={image} style={{display: "none"}} id="Maps" src="" alt="Missing"/>
                    <div id="arrowContainer">
                    </div>
                </div>
            </div>
        </div>
    );
}


//Zooms in or out on an arrow on the map
export function zoom() {
    let containerWidth;
    let containerHeight;
    try {
        let arrow = document.getElementById("arrow" + videoCounter);
        containerWidth = document.getElementById("mapContainer").clientWidth;
        containerHeight = document.getElementById("mapContainer").clientHeight;
        let zoomFactor = Math.min(containerWidth / arrow.naturalWidth, containerHeight / arrow.naturalHeight);
        mapSizeRatio = (zoomFactor * 0.9);
    }
    catch (err){
        console.log("arrow"+videoCounter+" does not exist!")
    }
    switch (zoomLevel){
        case "noZoom":{
            mapSizeRatio = containerWidth/image.current.naturalWidth;
            break;
        }
        case "halfZoom":{
            mapSizeRatio = Math.max(0.5*mapSizeRatio,0.2);
            break;
        }
        case "fullZoom":
        default:{
        }
    }
    updateArrows(mapSizeRatio);
    document.getElementById("Maps").style.width = mapSizeRatio * document.getElementById("Maps").naturalWidth.toString()+"px";
    if (videoCounter > 0) zoomOnArrow(false, videoCounter - 1);
    zoomOnArrow(true, videoCounter);
}


//Adjusts the size of the arrows depending on the level of zoom
function updateArrows(zoom){
    for (let i = 0; i < arrowOrderedData.length; i++) {
        let currentArrow = document.getElementById("arrow"+i);
        currentArrow.style.width = zoom * currentArrow.naturalWidth.toString()+"px";
        currentArrow.style.top = zoom * arrowOrderedData[i][0]+"px";
        currentArrow.style.left = zoom * arrowOrderedData[i][1]+"px";
        displayArrows(arrowDisplayStyle, i, currentArrow);
    }
}

//Displays specific arrow based on displayStyle
function displayArrows(displayStyle, index, currentArrow){// TODO add room id system
    switch (displayStyle) {
        case "upgrade":
            //every arrow until the next upgrade
            if (arrowOrderedData[videoCounter][3] === completeLoadoutData[index].loadOut.length){
                currentArrow.style.display = "block";
                break;
            }
            //arrow for next upgrade
            if (index > 0){
                if(arrowOrderedData[videoCounter][3] === completeLoadoutData[index - 1].loadOut.length){
                    currentArrow.style.display = "block";
                    break;
                }
            }
            currentArrow.style.display = "none";
            break;
        case "triple":
            if (index === videoCounter || (index - 1) === videoCounter || (index + 1) === videoCounter) currentArrow.style.display = "block";
            else currentArrow.style.display = "none";
            break;
        case "all":
            currentArrow.style.display = "block";
            break;
        case "none":
            currentArrow.style.display = "none";
            break;
        case "single":
        default:
            if (index === videoCounter) currentArrow.style.display = "block";
            else currentArrow.style.display = "none";
    }
}

//Updates the display style
export function updateDisplayStyle(displayStyle){
    arrowDisplayStyle = displayStyle;
    updateArrows(mapSizeRatio);
}


//Updates map and videos to fit the arrow clicked
export function arrowClicked(index){
    videoCounter = index;
    updateGuideView(false, true);
}

//Center map on arrow
function zoomOnArrow(isSmooth, counter){
    let behaviour = isSmooth ? 'smooth':'instant';
    try {
        let arrow = document.getElementById("arrow"+counter);
        arrow.scrollIntoView({
            behavior: behaviour,
            block: 'center',
            inline: 'center'
        });

    }
    catch (err){
        console.log("arrow"+counter+" does not exist!")
    }
}

export function openMap(){
    let panel = document.getElementById("bottompanel");
    if (panel.style.height === "0px") {
        panel.style.height = mapHeight;
        setTimeout(function (){mapOpen = true});
    }
    else {
        panel.style.height = "0px";
        mapOpen = false;
    }
    reload();
}
export function closeMap(){
    document.getElementById("bottompanel").style.height = "0px";
    mapOpen = false;
}

function reload(){
    let container = document.getElementById("imageContainer");
    container.style.height = "500px";
    changeMap();
}