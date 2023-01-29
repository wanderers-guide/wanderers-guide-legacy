import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

createApp(App).mount("#app");

// fetch this from some socket or endpoint:
const enabledLightMode = false;

// until we have tailwind/better bem, this is our conditional stylesheet imports:
if(enabledLightMode) {
    var element = document.createElement("link");
    element.setAttribute("rel", "stylesheet");
    element.setAttribute("type", "text/css");
    element.setAttribute("href", "/css/core/site-themes-light.css");
    document.getElementsByTagName("head")[0].appendChild(element);
}
else{
    var element = document.createElement("link");
    element.setAttribute("rel", "stylesheet");
    element.setAttribute("type", "text/css");
    element.setAttribute("href", "/css/core/site-themes-dark.css");
    document.getElementsByTagName("head")[0].appendChild(element);
}