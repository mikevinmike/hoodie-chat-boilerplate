"use strict";

// Select the chat form
var chatForm = $('[data-action="chat-input"]');

// Select the textarea from the chat form
var chatBox = $('[data-action="send-message"]');

// Setup keydown listener for power user message submitting, CMD/Ctrl + Enter
chatBox.on('keydown', checkSubmit);

function checkSubmit(e) {
    // if the CMD/Ctrl key and the Enter key are both pressed down, then send the message to the store
    if (e.metaKey && e.keyCode === 13) {
        sendMessage(e);
    }
}

// Select the chat stream area
var chatStream = $('[data-action="chat-stream"]');


// initialize Hoodie
var hoodie  = new Hoodie();

