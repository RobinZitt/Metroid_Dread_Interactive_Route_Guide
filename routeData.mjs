
export class RouteData{
    routeName;
    fileName;
    routeActive;
    startIndex;
    endIndex;
    subRoutes;

    constructor(routeName,fileName,routeActive,startIndex,endIndex,subRoutes) {
        this.routeName = routeName;
        this.fileName = fileName;
        this.routeActive = routeActive;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.subRoutes = subRoutes;
    }

}

export class AlternativeRouteData{
    routeName;
    fileName;
    routeActive;
    startIndex;
    endIndex;
    subRoutes;
    categories;

    constructor(routeName,fileName,routeActive,startIndex,endIndex,subRoutes,categories) {
        this.routeName = routeName;
        this.fileName = fileName;
        this.routeActive = routeActive;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.subRoutes = subRoutes;
        this.categories = categories;
    }

}

export class LoadOutData{
    missiles;
    eTanks;
    eParts;
    loadOut;
    newItems;

    constructor(missiles,eTanks,eParts,loadOut,newItems) {
    this.missiles = missiles;
    this.eTanks = eTanks;
    this.eParts = eParts;
    this.loadOut = loadOut;
    this.newItems = newItems;
    }
}

export function routeCreate(startingRoute, completeRoute, start, end, allRouteData){
    let subRoutes = startingRoute.subRoutes;
    let index = start;
    let endIndex;
    let nextRoute;
    for (let i = 0; i < subRoutes.length; i++) {
        let currentSubRoute = subRoutes[i];
        if (currentSubRoute["subRouteName"] === "") break;
        nextRoute = allRouteData.find((route) => route.routeName === currentSubRoute["subRouteName"]);
        if (currentSubRoute["subRouteActive"]){
            endIndex = currentSubRoute["subRouteStart"];
            while (index <= endIndex){
                let fileName = startingRoute.fileName + index;
                completeRoute.push(fileName);
                index++;
            }
            routeCreate(nextRoute,completeRoute,currentSubRoute["startIndex"],currentSubRoute["endIndex"],allRouteData);
            index = currentSubRoute["subRouteReturn"];
        }
    }
    endIndex = end;
    while (index <= endIndex){
        let fileName = startingRoute.fileName + index;
        completeRoute.push(fileName);
        index++;
    }
    return completeRoute;
}

