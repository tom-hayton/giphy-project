import { 
    fetchData,
    createWidget,
    getIsEmptyString,
    createGifElement,
    toggleFunctionsFactory,
} from './utils.js';
import { 
    randomImgContainer,
    isMobile
} from './script.js'

export const containerElement = document.querySelector('#random-section');

// const createRefreshBtn = (loadingWidget) => {
//     const refreshSVGBuilder = createSVGFactory('refresh');
//     // Create elements
//     const refreshSVG = refreshSVGBuilder();
//     const nextSpan = constructElement('span', "Next")
//     const btnEl = constructElement(
//         'button', 
//         "", 
//         [
//             {key: "class", value: "btn btn--flex btn--w100 random__btn"},
//             {key: "aria-label", value: "Next Random Gif"},
//         ],
//         el.parentElement,
//         [refreshSVG, nextSpan]
//     );
//     btnEl.addEventListener("click", () => fetchAndDisplay(loadingWidget));
//     return btnEl;
// }

export const init = () => {
    const loadingWidget = createWidget('loading');
    randomImgContainer.appendChild(loadingWidget);
    fetchAndDisplay(loadingWidget);
    const btnEl = document.querySelector('.random__btn')
    if(btnEl) btnEl.addEventListener("click", () => fetchAndDisplay(loadingWidget));
    
    return {loadingWidget};
};

export const { unMount, hide, show } = toggleFunctionsFactory('random');

// Add and remove img each time random gif is requested due to delay in switching from old gif to new gif, even after src attribute loaded
const addImg = (src = "", alt = "", classStr = "") => {
    const imgEl = createGifElement(src, alt, classStr)
    randomImgContainer.appendChild(imgEl)
}

const removeElement = () => {
    const imgEl = randomImgContainer.querySelector("img");
    if(imgEl) randomImgContainer.removeChild(imgEl)
}

const fetchAndDisplay = async (loadingWidget) => {
    const requestInit = {};
    loadingWidget.style.display = "flex";
    removeElement();
    const gifSrcKey = isMobile ? "fixed_height_downsampled" : "fixed_height";
    
    fetchData('random', requestInit)
        .then(res => {
            if(res instanceof Error) throw res;
            return res;
        })
        .then(resJson => {
            const { data, meta } = resJson;
            const {images, title: alt} = data;
            const trueAlt = getIsEmptyString(alt) ? "Randomized gif from giffy" : alt;
            const src = images[gifSrcKey].webp;
            addImg(src, trueAlt, "random__img");
        })
        .then(() => {
            loadingWidget.style.display = "none";
        })
        .catch(err => {
            console.log(err);
            const errorWidget = createWidget('error');
            randomImgContainer.appendChild(errorWidget);
        })
}