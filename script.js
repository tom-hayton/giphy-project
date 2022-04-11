import { 
    hide as hideRandom,
    show as showRandom,
    init as initRandom,
} from './random.js';

import {
    mount as mountFinder,
    hide as hideFinder,
    show as showFinder,
} from './finder.js';

import {
    mount as mountTrending,
    hide as hideTrending,
    show as showTrending,
} from './trending.js';

// Importing utils script here improves page load time due to script chaining, despite no variables/functions being used
import {} from './utils.js';

// variable declarations
const desktopThreshold_px = 700;
const mediaQueryObj = window.matchMedia(`(min-width: ${desktopThreshold_px}px)`);

const tabHideMap = new Map([
    ["random", hideRandom],
    ["finder", hideFinder],
    ["trending", hideTrending],
]);
const tabShowMap = new Map([
    ["random", showRandom],
    ["finder", showFinder],
    ["trending", showTrending],
]);

// Elements
const nav = document.querySelector("nav");
const navTabs = Array.from(nav.children[0].children);

// Mutable variables
export let isMobile = !mediaQueryObj.matches;
let currentTab = "random";
let isFinderMounted = false;
let isTrendingMounted = false;

// Functions
const constructPage = () => {
    isMobile = !mediaQueryObj.matches;
    if(isMobile) {
        if(currentTab !== 'random') hideRandom();
        if(isFinderMounted && currentTab !== 'finder') hideFinder();
        if(isTrendingMounted && currentTab !== 'trending') hideTrending();
        return;
    };
    showRandom();
    
    if(isFinderMounted) showFinder();
    else mountFinder();
    
    if(isTrendingMounted) showTrending();
    else mountTrending();
}

// mobile detection
window.addEventListener('resize', () => constructPage);
window.addEventListener('orientationchange', () => constructPage);

// mobile actions
const handleNavTabClick = function(e) {
    e.preventDefault();
    const prevTab = currentTab;
    tabHideMap.get(prevTab)();
    navTabs.forEach(tab => tab.setAttribute("aria-selected", false));
    this.setAttribute("aria-selected", true);
    currentTab = this.id;
    console.log(isMobile)
    if(currentTab === 'finder' && !isFinderMounted) {
        mountFinder();
        isFinderMounted = true;
    }
    if(currentTab === 'trending' && !isTrendingMounted) {
        mountTrending();
        isTrendingMounted = true;
    }
    tabShowMap.get(currentTab)()
}

navTabs.forEach((liElement) => {
    liElement.addEventListener('click', handleNavTabClick);
})

// desktop actions

// Load in random section
export const randomImgContainer = document.querySelector('.random__imgContainer');
export const randomSectionEl = document.querySelector('#random-section');
initRandom();
constructPage();