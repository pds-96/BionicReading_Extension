function toBionic(text) {
  return text.replace(/\w+/g, (word) => {
    const len = word.length;
    const splitIndex = Math.ceil(len * 0.5);
    const first = word.slice(0, splitIndex);
    const rest = word.slice(splitIndex);
    return `<b>${first}</b>${rest}`;
  });
}

function applyBionicReading(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeValue.trim().length > 0 && node.parentNode && !['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.parentNode.tagName)) {
      textNodes.push(node);
    }
  }

  textNodes.forEach(node => {
    const span = document.createElement('span');
    span.innerHTML = toBionic(node.nodeValue);
    node.parentNode.replaceChild(span, node);
  });
}

function revertBionicReading() {
  const spans = document.querySelectorAll('span');
  spans.forEach(span => {
    if (span.querySelector('b')) {
      const plainText = span.textContent;
      const textNode = document.createTextNode(plainText);
      span.replaceWith(textNode);
    }
  });
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enableBionic') {
    applyBionicReading();
  } else if (request.action === 'disableBionic') {
    revertBionicReading();
  }
});
