'use strict';

var hoodie  = new Hoodie();

// replace currentUser avatar data with the current username, if there is one, then fetch the real avatar.
if (hoodie.account.username) {
    $('[data-avatar="currentUser"]').attr('data-avatar', hoodie.account.username);
    fetchAvatar();
}

var avatarStore = hoodie.store('avatar');

$('.user-avatar').on('click', showFileInput);


function showFileInput(e) {
    var parent = $('#account');
    var fileInput = $('<input type="file" accept="image/png, image/jpeg, image/gif" data-action="uploadAvatar" />');
    var inputContainer = $('<div class="bg-white input-container"></div>');

    fileInput.on('change', handleImgUpload);

    inputContainer.append(fileInput);
    parent.prepend(inputContainer);
}

function handleImgUpload(e) {
    avatarProcess(e.target.files[0]);
    e.target.remove();
}

// create an avatar for re-use later
function avatarProcess(imgData) {
    function handleImg(img) {
        return function process(e) {
            var src = e.target.result;
            var props = {
                src: src,
                id: hoodie.account.username
            };

            saveAvatar(props);
        };
    }

    var reader = new FileReader();
    reader.onload = handleImg(imgData);
    reader.readAsDataURL(imgData);
}

function saveAvatar(props) {
    hoodie.store.updateOrAdd('avatar', hoodie.account.username, props).publish().then(function (avatar) {
        var avatarEl = $('[data-avatar="' + avatar[0].id + '"]');
        avatarEl[0].src = avatar[0].src;
    })
        .catch(function (error) {
            console.log(error);
        })

}

function fetchAvatar(user) {
    var user = user || hoodie.account.username;
    var imgEl = $('[data-avatar="' + user + '"]');

    hoodie.global.find('avatar', user)
        .then(function (avatar) {
            imgEl.attr('src', avatar.src);
        })
        .catch(function (error) {
            console.log(user, error);
            return;
        });
}
