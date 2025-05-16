document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('toggleBionic');

  // Load saved state
  chrome.storage.sync.get('bionicEnabled', (data) => {
    toggle.checked = data.bionicEnabled || false;
  });

  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    chrome.storage.sync.set({ bionicEnabled: isEnabled });

    // Tell content script to toggle Bionic mode
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: isEnabled ? 'enableBionic' : 'disableBionic'
        }, (response) => {
            if (chrome.runtime.lastError) {
            console.warn("Could not send message to content script:", chrome.runtime.lastError.message);
            } else {
            console.log("Message sent successfully");
            }
        });
    });

  });
});
