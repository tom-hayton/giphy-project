import { 
    unMount as unMountRandom,
    mount as mountRandom
} from './random.js';

// variable declarations
const desktopThreshold_px = 700;
const mediaQueryObj = window.matchMedia(`(min-width: ${desktopThreshold_px}px)`);
const tabMountMap = new Map([
    ["random", mountRandom],
    ["finder", mountRandom],
    ["trending", mountRandom],
]);
const tabUnMountMap = new Map([
    ["random", unMountRandom],
    ["finder", unMountRandom],
    ["trending", unMountRandom],
]);

// Elements
const nav = document.querySelector("nav");
const navTabs = Array.from(nav.children[0].children);

// Mutable variables
let isMobile = true;
let currentTab = "random";

// mobile detection
window.addEventListener('resize', () => isMobile = !mediaQueryObj.matches);

// mobile actions
const handleNavTabClick = function(e) {
    e.preventDefault();
    const prevTab = currentTab;
    tabUnMountMap.get(prevTab)();
    navTabs.forEach(tab => tab.setAttribute("aria-selected", false));
    this.setAttribute("aria-selected", true);
    currentTab = this.id;
    if(currentTab === 'random') tabMountMap.get(currentTab)()
}

navTabs.forEach((liElement) => {
    liElement.addEventListener('click', handleNavTabClick);
})

// desktop actions

// Load in random section
export const el = document.querySelector('.random__img-container');
mountRandom();
// const {loadingWidget} = initRandom();
// fetchRandom(loadingWidget);


// Load in finder section
if(isMobile && currentTab === 'finder') {

}


// Load in trending section