$("#address_copy").click(function(){
  var address = $(this).attr('data-address');
  console.log(address);
  copyTextToClipboard(address);
});

function iosCopyToClipboard(el) {
    var oldContentEditable = el.contentEditable,
        oldReadOnly = el.readOnly,
        range = document.createRange();

    el.contenteditable = true;
    el.readonly = false;
    range.selectNodeContents(el);

    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(range);

    el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

    el.contentEditable = oldContentEditable;
    el.readOnly = oldReadOnly;

    document.execCommand('copy');
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  var range = document.createRange();

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';

  textArea.value = text;

  textArea.contenteditable = true;
  textArea.readonly = false;

  document.body.appendChild(textArea);

  range.selectNodeContents(textArea);

  var s = window.getSelection();
  s.removeAllRanges();
  s.addRange(range);

  textArea.setSelectionRange(0, 999999);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    alert('Copying text command was ' + msg);
  } catch (err) {
    alert('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}