'use strict';

function streamNotification(notification) {
    var date = new Date(notification.date);

    // create template for notification
    var notifyTemplate = $('<div class="px1"></div>');
    var notifyContent = $('<h5 class="inline-block mr1 '+notification.status+'">'+notification.notification+'</h5>');
    var notifyDate = $('<span class="inline-block h6 regular muted">'+date.toLocaleTimeString()+'</span>');

    // insert data into template
    notifyTemplate.append(notifyContent);
    notifyTemplate.append(notifyDate);

    // insert template into chat stream
    notifyTemplate.appendTo(chatStream);

    // scroll the notification into view if it overflows the chat stream
    scrollIntoViewIfNeeded(notifyTemplate[0]);
}

function scrollIntoViewIfNeeded(element) {
    if (element.offsetTop > element.parentNode.offsetHeight) {
        element.scrollIntoView();
    }
}

// post newly added message to the stream
function streamMessage(message) {
    if(message.notification) { return streamNotification(message); }

    if (message.type !== 'message') { return; }

    var date = new Date(message.date);
    var bgColor = message.user === hoodie.account.username ? "bg-silver" : "bg-white";

    // create template to store message content
    var messageTemplate = $('<div class="p1 '+bgColor+' flex flex-stretch"></div>');
    var messageAvatar = $('<aside class="flex flex-stretch rounded overflow-hidden mr2"><img src="http://placekitten.com/g/50/50" width="50px" height="50px" data-avatar="'+message.user+'" /></aside>');
    var messageContentContainer = $('<div></div>');
    var messageUser = $('<h4 class="inline-block mt0 mr1">'+message.user+'</h4>');
    var messageDate = $('<span class="inline-block h6 regular muted">'+date.toLocaleTimeString()+'</span>');
    var messageContent = $('<p class="mb0">'+message.message+'</p>');

    // insert data into template
    messageTemplate.append(messageAvatar);
    messageContentContainer.append(messageUser);
    messageContentContainer.append(messageDate);
    messageContentContainer.append(messageContent);
    messageTemplate.append(messageContentContainer);

    // finally, insert template into the chat stream
    // then, clear out the chat box
    messageTemplate.appendTo(chatStream);

    // start async proces of fetching the avatar for this user
    fetchAvatar(message.user);

    // scroll the new message into view if it overflows the chat stream
    scrollIntoViewIfNeeded(messageTemplate[0]);
}