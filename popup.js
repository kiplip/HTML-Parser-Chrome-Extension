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

 
 
/*
  function findRepeatingPatterns() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getSource" }, (response) => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(response.source, "text/html");
        const divElements = htmlDoc.querySelectorAll("div");
        const patterns = new Map();
  
        divElements.forEach((div) => {
          const innerHTML = div.innerHTML.trim();
          if (innerHTML) {
            if (patterns.has(innerHTML)) {
              patterns.set(innerHTML, patterns.get(innerHTML) + 1);
            } else {
              patterns.set(innerHTML, 1);
            }
          }
        });
  
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";
  
        patterns.forEach((count, pattern) => {
          if (count > 1) {
            const patternDiv = document.createElement("div");
            patternDiv.innerHTML = `<b>Count:</b> ${count}<br><b>InnerHTML:</b> ${pattern.substring(0, 50)}...`;
            patternDiv.className = "pattern p-4 mb-4 bg-white border border-gray-200 rounded shadow";
            resultsDiv.appendChild(patternDiv);
          }
        });
      });
    });
  }
*/ 
function generateStructure(element) {
  if (!element.children.length) return element.tagName;

  const childrenStructure = Array.from(element.children)
    .map((child) => generateStructure(child))
    .join(",");
  return `${element.tagName}(${childrenStructure})`;
}
function findRepeatingPatterns() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getSource" }, (response) => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(response.source, "text/html");
      const divElements = htmlDoc.querySelectorAll("div");
      const patterns = new Map();

      divElements.forEach((div) => {
        const structure = generateStructure(div);
        if (patterns.has(structure)) {
          patterns.get(structure).count++;
          if (patterns.get(structure).examples.length === 0) {
            patterns.get(structure).examples.push(div);
          }
        } else {
          patterns.set(structure, { count: 1, examples: [] });
        }
      });

      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";

      patterns.forEach((value, structure) => {
        if (value.count > 1) {
          const sample = value.examples[0].outerHTML;
          const patternDiv = document.createElement("div");
          patternDiv.innerHTML = `<b>Count:</b> ${value.count}<br><b>Structure:</b> ${structure}<br><b>Sample:</b> ${sample.substring(0, 50)}...`;
          patternDiv.className = "pattern p-4 mb-4 bg-white border border-gray-200 rounded shadow";
          resultsDiv.appendChild(patternDiv);
        }
      });
    });
  });
}

document.getElementById("findPatternsBtn").addEventListener("click", findRepeatingPatterns);





function compareElementStyles(element1, element2) {
  const computedStyle1 = getComputedStyle(element1);
  const computedStyle2 = getComputedStyle(element2);

  const styleProperties = [
    'display',
    'position',
    'width',
    'height',
    'background-color',
    'color',
    'font-size',
    'font-weight',
    'text-align',
    // Add other style properties that you consider important for visual similarity
  ];

  return styleProperties.every((property) => computedStyle1[property] === computedStyle2[property]);
}
function findSimilarElements() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getSource" }, (response) => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(response.source, "text/html");
      const allElements = htmlDoc.querySelectorAll("*");

      const groups = [];

      allElements.forEach((element) => {
        let foundGroup = false;

        for (const group of groups) {
          const referenceElement = group[0];

          if (referenceElement.tagName === element.tagName && compareElementStyles(referenceElement, element)) {
            group.push(element);
            foundGroup = true;
            break;
          }
        }

        if (!foundGroup) {
          groups.push([element]);
        }
      });

      const similarGroups = groups.filter((group) => group.length > 1);

      similarGroups.forEach((group) => {
        const el = createHtmlElement(group[0]);
        el.innerHTML += ` - <b>Count:</b> ${group.length}`;
        resultsDiv.appendChild(el);
      });
    });
  });
}


// Add the following event listener to your existing popup.js file

document.getElementById("findSimilarBtn").addEventListener("click", findSimilarElements);





function accessibilityAnalysis(htmlDoc) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const issues = [];

  // Check for missing alt attributes on img elements
  const imgElements = htmlDoc.querySelectorAll("img");
  imgElements.forEach((img) => {
    if (!img.hasAttribute("alt")) {
      issues.push({
        element: img,
        message: "Missing alt attribute on img element.",
      });
    }
  });

  // Check for missing or empty title attributes on a, area, button, input, iframe, and select elements
  const interactiveElements = htmlDoc.querySelectorAll("a, area, button, input, iframe, select");
  interactiveElements.forEach((element) => {
    if (!element.hasAttribute("title") || element.getAttribute("title").trim() === "") {
      issues.push({
        element: element,
        message: `Missing or empty title attribute on ${element.tagName.toLowerCase()} element.`,
      });
    }
  });

  // Check for missing or empty label elements for input elements with type 'text', 'email', 'password', or 'search'
  const inputElements = htmlDoc.querySelectorAll("input[type=text], input[type=email], input[type=password], input[type=search]");
  inputElements.forEach((input) => {
    const id = input.getAttribute("id");
    if (id) {
      const label = htmlDoc.querySelector(`label[for='${id}']`);
      if (!label || label.textContent.trim() === "") {
        issues.push({
          element: input,
          message: `Missing or empty label element for input[type='${input.getAttribute("type")}'] element.`,
        });
      }
    } else {
      issues.push({
        element: input,
        message: `Missing id attribute on input[type='${input.getAttribute("type")}'] element.`,
      });
    }
  });

  issues.forEach((issue) => {
    const el = createHtmlElement(issue.element);
    const issueMessage = document.createElement("div");
    issueMessage.textContent = issue.message;
    issueMessage.style.color = "red";
    el.appendChild(issueMessage);
    resultsDiv.appendChild(el);
  });

  if (issues.length === 0) {
    const noIssuesMessage = document.createElement("div");
    noIssuesMessage.textContent = "No accessibility issues found.";
    noIssuesMessage.style.color = "green";
    resultsDiv.appendChild(noIssuesMessage);
  }
}

document.getElementById("accessibilityBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getSource" }, (response) => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(response.source, "text/html");
      accessibilityAnalysis(htmlDoc);
    });
  });
});
