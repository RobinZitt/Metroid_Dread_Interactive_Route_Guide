import {LoadOutData} from "./routeData.mjs";
import {videoCounter} from "./videoFunctions";
import tutorialData from "./tutorialData.json";

let missileCount = 30;
let eTankCount = 0;
let ePartCount = 0;
let currentLoadout = [];
let currentTutorials = [];
let tutorialLinks = [];
export let completeLoadoutData = [];
let additionalInfoList = [];

export function resetLoadout(){
    tutorialLinks = [];
    completeLoadoutData = [];
    additionalInfoList = [];
}

export function pushLoadoutInfo(currentLoadoutData, loadoutInfo){
    completeLoadoutData.push(currentLoadoutData);
    tutorialLinks.push(loadoutInfo.setupsUsed);
    additionalInfoList.push(loadoutInfo.additionalInfo);
}

//Saves loadout data in an array for every room in the route
export function setLoadoutData(itemsCollected,upgradeCollected,loadoutData,) {
    let newLoadoutData = new LoadOutData(
        loadoutData.missiles,
        loadoutData.eTanks,
        loadoutData.eParts,
        [],
        []
    );
    for (const i in loadoutData.loadOut) {
        newLoadoutData.loadOut.push(loadoutData.loadOut[i]);
    }
    if (upgradeCollected.length > 0){
        newLoadoutData.loadOut.push(upgradeCollected);
        newLoadoutData.newItems.push(upgradeCollected);
    }
    for (const i in itemsCollected) {
        newLoadoutData.newItems.push(itemsCollected[i]);
        switch (itemsCollected[i]) {
            case "missile tank": newLoadoutData.missiles += 2;
                break;
            case "missile tank +": newLoadoutData.missiles += 10;
                break;
            case "e-part": if (newLoadoutData.eParts >= 3) {
                newLoadoutData.eParts = 0;
                newLoadoutData.eTanks += 1;
            }
            else newLoadoutData.eParts += 1;
                break;
            case "e-tank": newLoadoutData.eTanks += 1;
                break;
            case "": break;
            default: console.log("Invalid item name"+ itemsCollected[i]);
        }
    }
    return newLoadoutData;
}

//Updates the loadout data panel to fit the current video
export function updateLoadoutData(){//TODO make use of newItems list
    try{
        let loadout = completeLoadoutData[videoCounter];
        missileCount = loadout.missiles;
        eTankCount = loadout.eTanks;
        ePartCount = loadout.eParts;
        currentLoadout = loadout.loadOut;
        currentTutorials = [];
        let currentTutorialData = tutorialLinks[videoCounter];
        for (const i in currentTutorialData) {
            if (currentTutorialData[i].length !== 0){
                currentTutorials.push(filterByTag(tutorialData["tutorials"] ,currentTutorialData[i]).links);
            }
        }
    }
    catch (err){
        console.log("Additional data is missing"+err);
    }
    loadAdditionInfo()
}

//Loads the loadout panel data and displays it
export function loadAdditionInfo(){
    const loadoutInfo = document.getElementById("loadoutInfo");
    while (loadoutInfo.firstChild) loadoutInfo.removeChild(loadoutInfo.lastChild);//clear arrows before generating
    let loadoutInfoBlock = document.createElement("p");
    loadoutInfoBlock.append(`Missiles: ${missileCount}`,document.createElement("BR"));
    loadoutInfoBlock.append(`E-Tanks: ${eTankCount}`,document.createElement("BR"));
    loadoutInfoBlock.append(`E-Parts: ${ePartCount}/4`,document.createElement("BR"));
    loadoutInfoBlock.append(`Current loadout: ${currentLoadout}`,document.createElement("BR"));
    loadoutInfoBlock.append(`Tutorials: ${currentTutorials}`,document.createElement("BR"));//TODO move to different section later

    document.getElementById("loadoutInfo").appendChild(loadoutInfoBlock);
}

export function LoadAdditionalInfo(){
    return(
        <div className="loadoutInfo" id="loadoutInfo">
            <p>
                Missiles: {missileCount}<br/>
                E-Tanks: {eTankCount}<br/>
                E-Parts: {ePartCount}<br/>
                Current Loadout: {currentLoadout}<br/>
                Tutorials: {currentTutorials}<br/>
            </p>
        </div>
    );
}

//Opens the loadout panel or closes it depending on its current state
export function openLoadoutInfo(){
    let panel = document.getElementById("sidepanel");
    if (panel.style.width === "0px") panel.style.width = "250px";
    else panel.style.width = "0px";
}

//Closes the loadout panel
export function closeLoadoutInfo(){
    document.getElementById("sidepanel").style.width = "0px";
}

//Returns a jsonObject based on the tag attribute
function filterByTag(jsonObject, tag){
    return jsonObject.filter(function (jsonObject){return (jsonObject["tag"] === tag);})[0];
}