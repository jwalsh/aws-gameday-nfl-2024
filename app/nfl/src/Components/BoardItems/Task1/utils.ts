
export function getPosition (position: string) {
    let positionName;
    switch (position) {
        case "QB":
        positionName =  "Quarterback";
        break;
        case "G":
        positionName =  "Gunner";
        break;
        case "RB":
        positionName = "Running Back";
        break;
        case "DB":
        positionName = "Defensive Back";
        break;
        case "TE":
        positionName = "Tight end";
        break;
        case "DT":
        positionName = "Defensive Tackle";
        break;
        case "C":
        positionName = "Centre";
        break;
        case "DE":
        positionName = "Defensive End";
        break;
        case "LS":
        positionName = "Long Snapper";
        break;
        case "CB":
        positionName = "Cornerback";
        break;
        case "MLB":
        positionName = "Middle Linebacker";
        break;
        case "FB":
        positionName = "Fullback";
        break;
        case "S":
        positionName = "Safety";
        break;
        case "WR":
        positionName = "Wide Receiver";
        break;
        case "FS":
        positionName = "Free Safety";
        break;
        case "ILB":
        positionName = "Inside Linebacker";
        break;
        case "LB":
        positionName = "Linebacker";
        break;
        case "HB":
        positionName = "Halfback";
        break;
        case "NT":
        positionName = "Nose Tackle";
        break;
        case "T":
        positionName = "Tackle";
        break;
        case "K":
        positionName = "Kicker";
        break;
        case "SS":
        positionName = "Strong safety";
        break;
        case "OLB":
        positionName = "Outside Linebacker";
        break;
        case "P":
        positionName = "Punter";
        break;
        default:
        positionName = position;
        break;
    }
    return positionName;
}

export function getTheFlag(college: string) {
    const usState = ['alabama','alaska','arizona','arkansas','california','colorado','connecticut','delaware','florida', 'georgia','hawaii','idaho','illinois','indiana','iowa','kansas','kentucky','louisiana','maine','maryland','massachusetts','michigan','minnesota','mississippi','missouri','montana','nebraska','nevada','new_hampshire','new_jersey','new_mexico','new_york','north_carolina','north_dakota','ohio','oklahoma','oregon','pennsylvania','rhode_island','south_carolina','south_dakota','tennessee','texas','utah','vermont','virginia','washington','west_virginia','wisconsin','wyoming'];
    let arrStr = college.split(" ");
    let prefixArray = ["North", "South", "New", "Rhode", "West"];
    let findState;
    if(prefixArray.includes(arrStr[0])){
        findState = college.replace(" ", "_").toLowerCase();
    } else {
        console.log(arrStr);
        let collegeSTR = college.toLowerCase().replace(' state',"").replace(' atlantic', "").replace(" tech", "").replace("southern ", "").replace(" christian", "").replace("eastern ", "");
        switch (collegeSTR) {
            case "appalachian":
            findState = "north_carolina"
            break;
            case "purdue" && "notre dame":
            findState = "indiana"
            break;
            case "auburn" && "samford":
            findState = "alabama"
            break;
            case "harvard":
            findState = "massachusetts"
            break;
            case "ucla" && "stanford" && "san diego":
            findState = "california"
            break;
            case "malone" && "kent":
            findState = "ohio"
            break;
            case "boise":
            findState = "idaho"
            break;
            case "ferris":
            findState = "michigan"
            break;
            case "baylor":
            findState = "texas"
            break;
            case "clemson" && "humboldt":
            findState = "south_carolina"
            break;
            default:
            findState = usState.find(a => a.includes(collegeSTR))
            break;
        }
        console.log(collegeSTR);
    }
    
    if (findState == null) {
        findState = "united_states"
    }
    let imgSrc = "/us-state-flags-svg/flags/" + findState + ".svg";
    console.log(imgSrc);
    return imgSrc;
}