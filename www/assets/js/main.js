"use strict";

// Select the chat form
var chatForm = $('[data-action="chat-input"]');

// Select the textarea from the chat form
var chatBox = $('[data-action="send-message"]');

// Setup keydown listener for power user message submitting, CMD/Ctrl + Enter
chatBox.on('keydown', checkSubmit);

function checkSubmit(e) {
    // if the Enter key without shift is pressed down, then send the message to the store
    if (e.keyCode === 13 && e.shiftKey !== true) {
        sendMessage(e);
    }
}

// Select the chat stream area
var chatStream = $('[data-action="chat-stream"]');


// initialize Hoodie
var hoodie  = new Hoodie();

// create a scoped 'message' store for easier re-use
var messageStore = hoodie.store('message');

hoodie.global.on('add', streamMessage);

// Setup submit event listener on chat form
chatForm.on('submit', sendMessage);

// create sendMessage function
function sendMessage(e) {
    e.preventDefault();

    // check for content in the chatBox,
    // if there is content,
    // then assign it to a variable
    // else, return false to cancel function
    var messageContent = chatBox.val().trim();

    if ( messageContent.length < 1 ) { return false; }

    // create a new message model
    var message = new MessageModel(messageContent);

    // using the global messageStore, add this message object and publish it to the global store.
    messageStore.add(message).publish();

    // trigger an immediate sync with the server
    hoodie.remote.push();

    // Dont't forget to clear out the charBox
    chatBox.val('');
}

// create a message model for re-use later
function MessageModel(message) {
    var user = hoodie.account.username;
    var postDate = new Date();

    return {
        'user': user,
        'date': postDate,
        'message': message
    };
}

function notifySignIn(e) {
    var notification = e + " has signed into the chat.";
    var model = new NotifyModel(notification, 'green');

    messageStore.add(model).publish();
}

function notifySignOut(e) {
    var notification = e + " has signed out or disconnected.";
    var model = new NotifyModel(notification, 'red');

    messageStore.add(model).publish();
}

// create a notification model for re-use later
function NotifyModel(notification, status) {
    var postDate = new Date();

    return {
        'date': postDate,
        'notification': notification,
        'status': status
    };
}

// global vs private
/* GLOBAL
 hoodie.global.on('add', streamMessage);
 messageStore.add(message).publish();
 */
/* PRIVATE
 messageStore.on('add', streamMessage);
 messageStore.add(message);
 */
// long polling
// save in localstorage
// go offline --> new message --> exit app --> go online --> open app
// plugins
// backend (server) code possible (email)
// couchdb hooks / data conversion possible
// couchdb replication

