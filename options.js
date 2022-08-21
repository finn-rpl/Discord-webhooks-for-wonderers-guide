// Saves options to chrome.storage
function save_options() {
  var discordURL = document.getElementById('discordURL').value;
  chrome.storage.sync.set({
    discordWebhookURL: discordURL
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('save');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = 'Save';
    }, 1000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    discordWebhookURL: 'Enter URL'
  }, function(items) {
    document.getElementById('discordURL').value = items.discordWebhookURL
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);