(() => {

  const checkStatus = (cssResponse) => {
    if (cssResponse.status >= 400) {
      if (cssResponse.status !== 404) {
        console.error(cssResponse);
      }

      throw new Error(cssResponse);
    }
  }

  const routerRootElementSelector = "#thin-router-content";
  const loadedScriptSelector = "#thin-router-script";
  const loadedStyleSelector = "#thin-router-style";

  const routerChanged = async (newUrl) => {
    console.log(newUrl);
    const hash = newUrl.split("/#")[1];
    if(!hash) {
      throw new Error("The url link is not correct. Make sure that you're using hash in url");
    }

    try {
      const routeHtmlFileUrl = `/views/${hash}/index.html`;
      const routeJsFileUrl = `/views/${hash}/index.js`;
      const routeCssFileUrl = `/views/${hash}/index.css`;
      console.log(`Getting ${routeHtmlFileUrl}`);
      const htmlResponse = await fetch(routeHtmlFileUrl);
      const htmlContent = await htmlResponse.text();

      const routerRootElement = document.querySelector(routerRootElementSelector);
      if(!routerRootElement) {
        throw new Error(`The router root DOM element with the selector ${routerRootElementSelector} doesn't exist`);
      }

      routerRootElement.innerHTML = htmlContent;

      try {
        const isScriptLoaded = document.querySelector(loadedScriptSelector);
        if(isScriptLoaded) {
          isScriptLoaded.remove();
        }

        console.log(`Getting ${routeJsFileUrl}`);
        const jsResponse = await fetch(routeJsFileUrl);
        checkStatus(jsResponse);
        const jsContent = await jsResponse.text();

        const thinRouterScript = document.createElement("script");
        thinRouterScript.innerHTML = jsContent;
        thinRouterScript.id = loadedScriptSelector.split("#")[1];
        thinRouterScript.type = "text/babel";

        if(!document.head) {
          const headElement = document.createElement("head");
          document.appendChild(headElement);
        }
  
        document.head.appendChild(thinRouterScript);

      } catch (e) {
        
      }

      try {
        const isStyleLoaded = document.querySelector(loadedStyleSelector);
        if(isStyleLoaded) {
          isStyleLoaded.remove();
        }
        
        console.log(`Getting ${routeCssFileUrl}`);
        const cssResponse = await fetch(routeCssFileUrl);
        checkStatus(cssResponse);
        const cssContent = await cssResponse.text();

        const thinRouterStyle = document.createElement("style");
        thinRouterStyle.innerHTML = cssContent;
        thinRouterStyle.id = loadedStyleSelector.split("#")[1];

        if(!document.head) {
          const headElement = document.createElement("head");
          document.appendChild(headElement);
        }
  
        document.head.appendChild(thinRouterStyle);
      } catch (e) {
        
      }
      
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
