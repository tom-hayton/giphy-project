import { 
    toggleShow,
    fetchData,
    createWidget,
    getIsEmptyString,
    createGifElement,
    createSVGFactory,
    constructElement
} from './utils.js';
import { el } from './script.js'

export const containerElement = document.querySelector('#random-section');



const init = () => {
    const refreshSVGBuilder = createSVGFactory('refresh');
    // Create elements
    const refreshSVG = refreshSVGBuilder();
    const nextSpan = constructElement('span', "Next")

    const btnEl = constructElement(
        'button', 
        "", 
        [
            {key: "class", value: "btn btn--flex btn--w100 random__btn"},
            {key: "aria-label", value: "Next Random Gif"},
        ],
        el.parentElement,
        [refreshSVG, nextSpan]
    )

    // const btnEl = document.createElement('button')
    // // const refreshSVG = refreshSVGBuilder();
    // // const nextSpan = document.createElement('span');

    // nextSpan.innerText = "Next";

    // btnEl.appendChild(refreshSVG);
    // btnEl.appendChild(nextSpan);

    // btnEl.setAttribute('class', 'btn btn--flex btn--w100 random__btn');
    // btnEl.setAttribute('aria-label', 'Next Random Gif');
    
    const loadingWidget = createWidget('loading');
    el.appendChild(loadingWidget);
    // el.parentElement.appendChild(btnEl);
    btnEl.addEventListener("click", () => fetchAndDisplay(loadingWidget));

    return {btnEl, loadingWidget};
};

export const mount = () => {
    const {loadingWidget} = init();
    fetchAndDisplay(loadingWidget);
}

export const unMount = () => {
    const rem = document.querySelector('#random-section');
    if(rem) rem.remove();
}

const addImg = (src = "", alt = "", classStr = "") => {
    const imgEl = createGifElement(src, alt, classStr)
    el.appendChild(imgEl)
}

const removeElement = () => {
    const imgEl = el.querySelector("img");
    if(imgEl) el.removeChild(imgEl)
}

const fetchAndDisplay = async (loadingWidget) => {
    const requestInit = {};
    loadingWidget.style.display = "flex";
    removeElement();
    
    fetchData('random', requestInit)
        .then(resJson => {
            const { data, meta } = resJson;
            const {images, title: alt} = data;
            const trueAlt = getIsEmptyString(alt) ? "Randomized gif from giffy" : alt;
            const src = images.original.webp;
            addImg(src, trueAlt, "random__img");
        })
        .then(() => {
            loadingWidget.style.display = "none";
        })
        .catch(err => {
            console.log(err);
        })
}