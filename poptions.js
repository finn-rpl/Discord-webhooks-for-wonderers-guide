function save_options() {
  var discordURL = document.getElementById('urlContainer').value;
  console.log('line 3')
  chrome.storage.sync.set({
    discoURL: discordURL
  }, function() {
    console.log('line 7')
    // Update status to let user know options were saved.
    var status = document.getElementById('urlContainer');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  console.log('line 21')
  chrome.storage.sync.get({
    discoURL: 'default'
  }, function(items) {
    document.getElementById('discordURL').value = items.discoURL;
  });
  console.log('line 27')
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);