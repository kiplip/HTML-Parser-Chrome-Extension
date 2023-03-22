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
    console.log(allElements);
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

          // Add mouseover and mouseout event listeners for highlighting elements
    el.addEventListener("mouseover", () => {
        highlightElement(element, true);
      });
      el.addEventListener("mouseout", () => {
        highlightElement(element, false);
      });



      el.addEventListener("click", () => {
        const selectedDiv = document.getElementById("selected");
        const selectedElement = createSelectedElement(element);
        selectedDiv.appendChild(selectedElement);
      });
      resultsDiv.appendChild(el);
    });
  }
  


  function createSelectedElement(element) {
    const div = document.createElement("div");
    div.className = "flex justify-between items-center mb-4 bg-white border border-gray-200 rounded shadow p-4"; // Tailwind CSS classes for card style
    div.style.width = "100%";
    
    const detailsDiv = document.createElement("div");
    detailsDiv.innerHTML = `<b>Selector:</b> ${getSelector(element)}<br><b>HTML:</b> ${element.outerHTML}`;
    div.appendChild(detailsDiv);
  
    const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "bg-red-500 text-white px-2 py-1 rounded"; // Tailwind CSS classes for red button
  deleteButton.addEventListener("click", () => {
    div.remove();
  });
  div.appendChild(deleteButton);

  
    return div;
  }

  function highlightElement(element, highlight) {
    const originalBackgroundColor = element.style.backgroundColor;
    const originalOutline = element.style.outline;
  
    if (highlight) {
      element.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
      element.style.outline = "1px solid rgba(255, 255, 0, 0.5)";
    } else {
      element.style.backgroundColor = originalBackgroundColor;
      element.style.outline = originalOutline;
    }
  }



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
    const selectedDiv = document.getElementById("selected");
    resultsDiv.innerHTML = "";
    selectedDiv.innerHTML = "";
  });
  
  document.getElementById("reparseBtn").addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "getSource"}, parseHtml);
    });
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

 

 // JavaScript code for tab switching
 document.getElementById("tab1").addEventListener("click", function() {
  document.getElementById("tab1Content").style.display = "block";
  document.getElementById("tab2Content").style.display = "none";
  document.getElementById("tab1").classList.add("bg-blue-500");
  document.getElementById("tab1").classList.add("text-white");
  document.getElementById("tab2").classList.remove("bg-blue-500");
  document.getElementById("tab2").classList.remove("text-white");
  document.getElementById("tab2").classList.add("bg-gray-300");
  document.getElementById("tab2").classList.add("text-black");
});

document.getElementById("tab2").addEventListener("click", function() {
  document.getElementById("tab1Content").style.display = "none";
  document.getElementById("tab2Content").style.display = "block";
  document.getElementById("tab2").classList.add("bg-blue-500");
  document.getElementById("tab2").classList.add("text-white");
  document.getElementById("tab1").classList.remove("bg-blue-500");
  document.getElementById("tab1").classList.remove("text-white");
  document.getElementById("tab1").classList.add("bg-gray-300");
    document.getElementById("tab1").classList.add("text-black");
  });