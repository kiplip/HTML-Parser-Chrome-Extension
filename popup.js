function createHtmlElement(element) {
  const div = document.createElement("div");
  div.className = "htmlElement p-4 mb-4 bg-white border border-gray-200 rounded shadow";
  div.dataset.selector = getSelector(element);
  
    const tagName = document.createElement("b");
    tagName.textContent = element.tagName.toLowerCase();
    div.appendChild(tagName);
  
    if (element.id) {
      const id = document.createElement("span");
      id.textContent = `#${element.id}`;
      id.style.color = "blue";
      div.appendChild(id);
    }
  

    if (element.className) {
        const classNames = document.createElement("span");
        classNames.textContent = `.${(element.className.toString()).replace(/\s+/g, '.')}`; // Convert className to string
        classNames.style.color = "green";
        div.appendChild(classNames);
      }

    const contentPreview = document.createElement("span");
    contentPreview.textContent = ` - ${element.textContent.trim().substring(0, 20)}...`;
    contentPreview.style.color = "gray";
    div.appendChild(contentPreview);
  
    return div;
  }
  
 
  
  function getSelector(element) {
    const path = [];
    while (element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.id) {
        selector += "#" + element.id;
      }
      path.unshift(selector);
      element = element.parentNode;
    }
    return path.join(" > ");
  }
   

  function parseHtml(response) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(response.source, 'text/html');
    const allElements = htmlDoc.querySelectorAll('*');
     
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
  

    // Add event listener for searchBar
  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", () => {
    const searchText = searchBar.value.toLowerCase();
    const allParsedElements = document.querySelectorAll(".parsedElement");

    allParsedElements.forEach((element) => {
      const elementText = element.textContent.toLowerCase();

      if (elementText.includes(searchText)) {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }
    });
  });


    // Update the event listener for clicking an element in the results div
    allElements.forEach((element) => {
      const el = createHtmlElement(element);

        // Add delete button to parsed elements
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "ml-2 bg-red-500 text-white px-2 py-1 rounded"; // Tailwind CSS classes for red button
        deleteButton.addEventListener("click", () => {
          el.remove();
        });
        el.appendChild(deleteButton);

 
 
      resultsDiv.appendChild(el);
    });
  }
  


  function createHtmlElement(element) {
    const div = document.createElement("div");
    div.className = "htmlElement p-4 mb-4 bg-white border border-gray-200 rounded shadow";
    div.dataset.selector = getSelector(element);
    
    const tagName = document.createElement("b");
    tagName.textContent = element.tagName.toLowerCase();
    div.appendChild(tagName);
  
    if (element.id) {
      const id = document.createElement("span");
      id.textContent = `#${element.id}`;
      id.style.color = "blue";
      div.appendChild(id);
    }
  
    if (element.className) {
      const classNames = document.createElement("span");
      classNames.textContent = `.${(element.className.toString()).replace(/\s+/g, '.')}`; // Convert className to string
      classNames.style.color = "green";
      div.appendChild(classNames);
    }
  
    const contentPreview = document.createElement("span");
    contentPreview.textContent = ` - ${element.textContent.trim().substring(0, 20)}...`;
    contentPreview.style.color = "gray";
    div.appendChild(contentPreview);
  
    // Display the full XPath
    const xpath = document.createElement("div");
    xpath.innerHTML = `<b>XPath:</b> ${generateXPath(element)}`;
    div.appendChild(xpath);
  
    // Display innerHTML, truncated to 50 characters
    const innerHtml = document.createElement("div");
    innerHtml.innerHTML = `<b>InnerHTML:</b> ${element.innerHTML.substring(0, 50)}...`;
    div.appendChild(innerHtml);
  
    return div;
  }
  
  function generateXPath(element) {
    if (element.id !== '') {
      return '//*[@id="' + element.id + '"]';
    }
  
    if (element === document.body) {
      return element.tagName;
    }
  
    let ix = 0;
    const siblings = element.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (sibling === element) {
        return generateXPath(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
      }
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
        ix++;
      }
    }
  }
  
  // Rest of the popup.js code remains the same
  
 



  function searchElements() {
    const searchText = searchBar.value.toLowerCase();
    const allParsedElements = document.querySelectorAll("#results .htmlElement");
  
    allParsedElements.forEach((element) => {
      const elementText = element.textContent.toLowerCase();
  
      if (elementText.includes(searchText)) {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }
    });
  }


  function getFocusedElement() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.executeScript(
          tabs[0].id,
          {
            code: 'document.activeElement.outerHTML;',
          },
          (results) => {
            resolve({ source: results[0] });
          }
        );
      });
    });
  }
  





  document.getElementById("parseBtn").addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "getSource"}, parseHtml);
    });
  });
  
  document.getElementById("resetBtn").addEventListener("click", () => {
    const resultsDiv = document.getElementById("results");
     resultsDiv.innerHTML = "";
   });
  
 

 

  // Add event listener for search button
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.addEventListener("click", () => {
    searchElements();
  });
  

  // Automatically show the tree structure of the focused element
  document.addEventListener("DOMContentLoaded", async () => {
    const focusedElement = await getFocusedElement();
    parseHtml(focusedElement);
  });

 
 