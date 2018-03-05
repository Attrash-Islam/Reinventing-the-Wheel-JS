(() => {

  const routerRootElementSelector = "#thin-router-content";
  const loadedScriptSelector = "#thin-router-script"
  const routerChanged = async (newUrl) => {
    console.log(newUrl);
    const hash = newUrl.split("/#")[1];
    if(!hash) {
      throw new Error("The url link is not correct. Make sure that you're using hash in url");
    }

    try {
      const routeHtmlFileUrl = `/views/${hash}/index.html`;
      const routeJsFileUrl = `/views/${hash}/index.js`;
      console.log(`Getting ${routeHtmlFileUrl}`);
      console.log(`Getting ${routeJsFileUrl}`);
      const response = await fetch(routeHtmlFileUrl);
      const htmlContent = await response.text();
      const routerRootElement = document.querySelector(routerRootElementSelector);
      if(!routerRootElement) {
        throw new Error(`The router root DOM element with the selector ${routerRootElementSelector} doesn't exist`);
      }

      routerRootElement.innerHTML = htmlContent;
      const isScriptLoaded = document.querySelector(loadedScriptSelector);
      if(isScriptLoaded) {
        isScriptLoaded.remove();
      }

      const thinRouterScript = document.createElement("script");
      thinRouterScript.src = routeJsFileUrl;
      thinRouterScript.id = loadedScriptSelector.split("#")[1];
      thinRouterScript.type = "text/babel";
      
      if(!document.head) {
        const headElement = document.createElement("head");
        document.appendChild(headElement);
      }

      document.head.appendChild(thinRouterScript);
      //@ts-ignore
      Babel.transformScriptTags(document.querySelectorAll(loadedScriptSelector));

    } catch(e) {
      throw e;
    }
  }

  routerChanged(window.location.href);

  window.onhashchange = (hashChangeEvent) => { 
    routerChanged(hashChangeEvent.newURL);
  }

})();
