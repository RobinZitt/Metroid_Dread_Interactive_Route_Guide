import {RouteData,routeCreate,LoadOutData, AlternativeRouteData} from "./routeData.mjs";
import routeData from "./routeData.json";
import alternativeRouteData from './alternativeRoutes.json';
import {arrowClicked, image} from "./mapFunctions";
import {pushLoadoutInfo, resetLoadout, setLoadoutData} from "./loadoutFunctions";
import {updateGuideView} from "./App";
import {resetVideoCounter, video} from "./videoFunctions";


let allAlternativeRouteData = [];
const arrowsFolderName = "./ArrowImages/";
export let completeRoute = [];
export let arrowOrderedData = [];


export function AllLabels(){
    let labelList = [];
    for (let i = 0; i < alternativeRouteData.routes.length; i++) {
        let newAlternativeRoute = new AlternativeRouteData(
            alternativeRouteData.routes[i].routeName,
            alternativeRouteData.routes[i].fileName,
            alternativeRouteData.routes[i].routeActive,
            alternativeRouteData.routes[i].startIndex,
            alternativeRouteData.routes[i].endIndex,
            alternativeRouteData.routes[i].subRoutes,
            alternativeRouteData.routes[i].categories
        );
        allAlternativeRouteData.push(newAlternativeRoute);
        labelList.push(<CreateAltRouteLabel key = {i} AlternativeRoute={newAlternativeRoute}/>);
    }
    return(
        <div className="dropdown">
            <button id="routesButton" className="dropButton">Alternatives</button>
            <div id="routeOptions" className="dropdown-content">
                {labelList}
            </div>
        </div>
    );
}

function CreateAltRouteLabel( {AlternativeRoute}) {
    return(
        <label
            id={AlternativeRoute.routeName + "Label"}
            htmlFor={AlternativeRoute.routeName + "Checkbox"}
            style={{marginRight:"20px", backgroundColor: "cyan", border: "none", borderRadius: "20px"}}
        >
            {AlternativeRoute.routeName}
            <input
                type={"checkbox"}
                id={AlternativeRoute.routeName + "Checkbox"}
                name={AlternativeRoute.routeName + "Checkbox"}
                style={{accentColor:"cyan"}}
            />
        </label>
    );
}



export async function generateRoute() {
    //initialize variables
    resetVideoCounter();
    resetLoadout();
    completeRoute = [];
    let allRouteData = [];
    let currentLoadoutData = new LoadOutData(30,0,0,[],[]);//TODO change missile count for normal mode
    arrowOrderedData = [];
    //let currentRoomIds = [];
    let roomIndex = 0;
    //Load data into allRouteData
    for (let i = 0; i < routeData.routes.length; i++) {
        let newRoute = new RouteData(
            routeData.routes[i].routeName,
            routeData.routes[i].fileName,
            routeData.routes[i].routeActive,
            routeData.routes[i].startIndex,
            routeData.routes[i].endIndex,
            copySubRoutes(routeData.routes[i].subRoutes)
        );
        allRouteData.push(newRoute);
    }
    let routeName = getRoute();
    let startingRoute =  allRouteData.find((route) => route.routeName === routeName);
    addAlternativeRoutes(startingRoute);
    completeRoute = routeCreate(startingRoute, [], startingRoute.startIndex, startingRoute.endIndex, allRouteData);
    //Display videos, map and buttons
    video.current.style.display = "block";
    image.current.style.display = "block";
    let buttonArray = [
        "imageContainer",
        "previousButtonMap",
        "nextButtonMap",
        "videoControls",
        "testButton",
        "zoomLevel",
        "arrowDisplay",
        "openButton",
        "mapButton"
    ];
    for (const buttonName of buttonArray) {
        document.getElementById(buttonName).style.removeProperty("display");
    }
    const arrowContainer = document.getElementById("arrowContainer");
    //clear arrows before generating
    while (arrowContainer.firstChild) arrowContainer.removeChild(arrowContainer.lastChild);
    //position and display arrows
    for (let i = 0; i < completeRoute.length; i++) {
        let currentArrow;
        currentArrow = document.createElement("img");
        currentArrow.id = "arrow" + i;
        let folder = completeRoute[i].split("_")[0];
        let index = completeRoute[i].split("_")[1];
        try{
            currentArrow.src = arrowsFolderName + folder+"/"+ completeRoute[i] + ".png";
            let arrowDataImport = await import ("../public/ArrowData/"+folder+".json");
            let arrowInfo = filterByIndex(arrowDataImport.default["info"], parseInt(index));
            currentArrow.classList.add("arrowPos");
            currentArrow.style.top = arrowInfo.topPosition + "px";
            currentArrow.style.left = arrowInfo.leftPosition + "px";
            /* TODO change system back to room ids later
            for (let j = 0; j < arrowInfo.roomIds.length; j++) {
                if (currentRoomIds.includes(arrowInfo.roomIds[j])){
                    currentRoomIds = [];
                    roomIndex++;
                }
                currentRoomIds.push(arrowInfo.roomIds[j]);

            }
            */
            arrowOrderedData[i] = [arrowInfo.topPosition, arrowInfo.leftPosition, arrowInfo.zoom];
            currentArrow.addEventListener("click", function () {
                arrowClicked(i)
            });
            //currentArrow.style.display = "none";
            document.getElementById("arrowContainer").appendChild(currentArrow);
        }
        catch (err){
            console.log("Arrow data for "+ completeRoute[i] +" not found");
        }
        //load loadout info
        try{
            let loadoutInfoImport = await import("../public/LoadoutInfo/"+folder+".json");
            let loadoutInfo = filterByIndex(loadoutInfoImport.default["info"], parseInt(index));
            if (loadoutInfo.upgradeCollected.length !== 0) roomIndex++;
            arrowOrderedData[i][3] = roomIndex;
            currentLoadoutData = setLoadoutData(loadoutInfo.itemsCollected,loadoutInfo.upgradeCollected, currentLoadoutData);
            pushLoadoutInfo(currentLoadoutData, loadoutInfo);
        }
        catch (err){
            console.log("Loadout data for "+ completeRoute[i] +" not found");
        }
    }
    updateGuideView(false, false);
    document.getElementById("videoSlider").value = 0;
    console.log(completeRoute)
}

function getRoute(){
    let glitchCategorySelect = document.getElementById("glitchCategorySelect");
    let glitchCategory = glitchCategorySelect.options[glitchCategorySelect.selectedIndex].text.toString();
    let categorySelect = document.getElementById("categorySelect");
    let category = categorySelect.options[categorySelect.selectedIndex].text.toString();
    let categoryName = "";
    let glitchCategoryName = "";
    switch (category){
        case "Any%":
            categoryName = "anyPercent";
            break;
        case "100%":
            categoryName = "hundo";
            break;
        case "All Bosses":
            categoryName = "AB";
            break;
        case "0%":
            categoryName = "zeroPercent";
            break;
        case "Minimum Items":
            categoryName = "MinItems";
    }
    switch (glitchCategory){
        case "Unrestricted":
            glitchCategoryName = "UR";
            break;
        case "Unrestricted (Multi-File)":
            glitchCategoryName = "UR-MF";
            break;
        case "No Major Glitches":
            glitchCategoryName = "NMG";
            break;
        case "Glitchless":
            glitchCategoryName = "GL";
            break;
    }
    return categoryName + "_" + glitchCategoryName;
}

function addAlternativeRoutes(mainRoute){
    let routeOptions = document.getElementById("routeOptions").children;
    for (let i = 0; i < routeOptions.length; i++) {
        let subRouteName = routeOptions[i].firstChild.textContent;
        let subRouteActive = routeOptions[i].lastChild.checked;
        if (subRouteActive) setAlternativeRoute(subRouteName, mainRoute);
    }
}

function setAlternativeRoute(routeName, mainRoute){
    let categoryName = mainRoute.routeName;
    let route = allAlternativeRouteData.find((route) => route.routeName === routeName);
    let categoryIndexes = route.categories.find((category) => category.name === categoryName);
    let subRoute = {
        "subRouteName": route.routeName,
        "subRouteStart": categoryIndexes.subRouteStart,
        "subRouteReturn": categoryIndexes.subRouteReturn,
        "startIndex": route.startIndex,
        "endIndex": route.endIndex,
        "subRouteActive": route.routeActive
    }
    for (let i = 0; i < mainRoute.subRoutes.length; i++) {
        if (subRoute.subRouteStart < mainRoute.subRoutes[i].subRouteStart){
            mainRoute.subRoutes.splice(i,0,subRoute);
            return;
        }
    }
}

export function updateAlternatives(){
    let routeName = getRoute();
    for (let i = 0; i < allAlternativeRouteData.length; i++) {
        let mainRoute = allAlternativeRouteData[i].categories.find((category) => category.name === routeName);
        let altRoute = document.getElementById(allAlternativeRouteData[i].routeName+"Label");
        if (mainRoute !== undefined) {
            altRoute.style.display = "block";
        }
        else{
            altRoute.style.display = "none";
            altRoute.lastChild.checked = false;
        }
    }
}

function copySubRoutes(subRoutes){
    let SubRoutesCopy = [];
    for (let i = 0; i < subRoutes.length; i++) {
        let newSubRoute = {
            "subRouteName": subRoutes[i].subRouteName,
            "subRouteStart": subRoutes[i].subRouteStart,
            "subRouteReturn": subRoutes[i].subRouteReturn,
            "startIndex": subRoutes[i].startIndex,
            "endIndex": subRoutes[i].endIndex,
            "subRouteActive": subRoutes[i].subRouteActive
        }
        SubRoutesCopy.push(newSubRoute);
    }
    return SubRoutesCopy;
}

//Returns a jsonObject based on the index attribute
function filterByIndex(jsonObject, index){
    return jsonObject.filter(function (jsonObject){ return (jsonObject["index"] === index);})[0];
}
