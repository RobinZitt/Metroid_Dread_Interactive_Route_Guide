import './App.css';
import React from "react";
import {useRef} from "react";
import {closeMap, changeMap, updateZoom, updateDisplayStyle, openMap, zoom, ShowMap, mapOpen} from './mapFunctions';
import {
    changeVideo,
    fullscreenChanger,
    InitVideoRefs,
    nextVideo,
    playPause,
    previousVideo,
    video,
    video2,
    VideoPlayer,
    videoResize
} from './videoFunctions';
import {updateLoadoutData, closeLoadoutInfo, openLoadoutInfo, LoadAdditionalInfo} from './loadoutFunctions';
import {AllLabels, generateRoute, updateAlternatives} from "./loadRoute";




export let routeOptions;


function App() {
    InitVideoRefs();
    routeOptions = useRef(null);
    document.body.style.backgroundImage = "url(BackgroundImages/Metroid_Dread_Overview_Dread_Img01.jpg)";
    document.body.style.backgroundSize = "cover";
    document.onfullscreenchange = function (){fullscreenChanger()};
    window.addEventListener('click', function (e){
        if (mapOpen && !document.getElementById("bottompanel").contains(e.target)){
            closeMap();
        }
    });
    window.addEventListener("resize",function (){
        zoom();
        videoResize();
    });
    document.addEventListener('keydown', function (event){
        if (video.current.style.display === "none" && video2.current.style.display === "none") return;
        let isVideo1=(video.current.style.display === "block");
        let currentVideo = isVideo1 ? video.current : video2.current;
        switch (event.key){
            case "ArrowRight":{
                currentVideo.currentTime += 5;
                break;
            }
            case "ArrowLeft":{
                if (currentVideo.currentTime < 2) {
                    previousVideo(isVideo1, true, true);
                }
                else
                    currentVideo.currentTime -= 5;
                break;
            }
            case " ":{
                playPause();
                break;
            }
            case "l":{
                openLoadoutInfo();
                break;
            }
            case "m":{
                openMap();
                break;
            }
        }
    });

    return (
        <>
            <div className="row">
                <div className="routeSelection" id="routeSelection">
                    <label>
                        <select onChange={updateAlternatives} id="glitchCategorySelect">
                            <option value="0">Unrestricted</option>
                            <option value="1">Unrestricted (Multi-File)</option>
                            <option value="2">No Major Glitches</option>
                            <option value="3">Glitchless</option>
                        </select>
                    </label>
                    <label>
                        <select id="categorySelect">
                            <option value="0">Any%</option>
                            <option value="1">100%</option>
                            <option value="2">All Bosses</option>
                            <option value="3">0%</option>
                            <option value="4">Minimum Items</option>
                        </select>
                    </label>
                    <AllLabels/>
                    <button onClick={generateRoute} id="generateButton">Generate</button>
                    <button onClick={openLoadoutInfo} id="openButton" className="openButton"
                            style={{display: "none"}}>Show/Hide Loadout
                    </button>
                    <button onClick={openMap} id="mapButton" className="openButton" style={{display: "none"}}>Show/Hide
                        Map
                    </button>
                </div>
                <div id="vCon" className="videoContainer">
                    <VideoPlayer/>
                </div>
                <div id="sidepanel" className="sidepanel" style={{width: 0}}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={closeLoadoutInfo} id="closeButton" className="closeButton">x</a>
                    <LoadAdditionalInfo/>
                </div>
            </div>
            <div className="row2">
                <div id="bottompanel" className="bottompanel" style={{height: 0}}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={closeMap} id="closeMap" className="closeButton">x</a>
                    <button style={{display: "none"}} id="testButton">Test</button>
                    <button onClick={() => previousVideo(undefined, false)} style={{display: "none"}}
                            id="previousButtonMap">Previous segment
                    </button>
                    <button onClick={() => nextVideo(undefined, false)} style={{display: "none"}}
                            id="nextButtonMap">Next segment
                    </button>
                    <div className="dropdown">
                        <button style={{display: "none"}} id="zoomLevel" className="dropButton">Zoom level</button>
                        <div className="dropdown-content">
                            <button onClick={() => updateZoom("fullZoom")} id="fullZoom">Full zoom</button>
                            <button onClick={() => updateZoom("halfZoom")} id="halfZoom">Half zoom</button>
                            <button onClick={() => updateZoom("noZoom")} id="noZoom">No zoom</button>
                        </div>
                    </div>
                    <div className="dropdown">
                        <button style={{display: "none"}} id="arrowDisplay" className="dropButton">Arrow display
                        </button>
                        <div className="dropdown-content">
                            <button onClick={() => updateDisplayStyle("single")} id="singleArrow">Show single arrow
                            </button>
                            <button onClick={() => updateDisplayStyle("triple")} id="tripleArrows">Show neighbor
                                arrows
                            </button>
                            <button onClick={() => updateDisplayStyle("upgrade")} id="upgradeArrows">Show arrows until
                                next upgrade
                            </button>
                            <button onClick={() => updateDisplayStyle("all")} id="allArrows">Show all arrows</button>
                            <button onClick={() => updateDisplayStyle("none")} id="noArrows">Show no arrows</button>
                        </div>
                    </div>
                    <ShowMap/>
                </div>
            </div>
        </>
    );
}


export function updateGuideView(isVideo1, autoPlay, playFromEnd = false) {
    changeVideo(isVideo1, autoPlay, playFromEnd);
    changeMap();
    updateLoadoutData();
}


export default App;
