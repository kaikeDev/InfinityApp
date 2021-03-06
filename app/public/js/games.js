'use strict';

var iconExtractor = require('icon-extractor');
var path = require('path');
var fs = require('fs');
var child = require('child_process');
var File;
var indexedit;

try {
    File = require(path.resolve(process.cwd(), './File.js'));
} catch (err) {
    File = require(path.resolve(process.cwd(), './resources/app/File.js'));
}

iconExtractor.emitter.on('icon', function(data) {
    console.log('Here is my context: ' + data.Context);
    console.log('Here is the path it was for: ' + data.Path);
    var folder_path = process.env.APPDATA + "/InfinityApp/games/";
    var image_path = process.env.APPDATA + `/InfinityApp/games/${data.Context}_icon.png`;
    var icon = data.Base64ImageData;

    if (!fs.existsSync(folder_path)) {
        fs.mkdirSync(folder_path);
        fs.chmodSync(folder_path, '777');
    }

    if (!fs.existsSync(image_path)) {
        fs.writeFile(image_path, icon, 'base64', (err) => {
            if (err) console.log(err);
        });
    }
});

var fileTypes = [
    'application/x-msdownload',
]

var preview = $('.preview');
var input = document.getElementById('game_exe');
var sep_data = {};

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

function validFileType(file) {
    for (var i = 0; i < fileTypes.length; i++) {
        console.log(file.type)
        if (file.type === fileTypes[i]) {
            return true;
        }
    }

    return false;
}

function returnFileSize(number) {
    if (number < 1024) {
        return number + 'bytes';
    } else if (number > 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + 'KB';
    } else if (number > 1048576) {
        return (number / 1048576).toFixed(1) + 'MB';
    }
}

function updateImageDisplay() {
    if (preview.children()) {
        preview.children().remove();
    }

    var curFiles = input.files;
    if (curFiles.length === 0) {
        preview.append(`
            <p>Vazio... Quer preenche-lo?</p>
        `)
    } else {
        for (var i = 0; i < curFiles.length; i++) {
            if (validFileType(curFiles[i])) {
                iconExtractor.getIcon(curFiles[i].name, curFiles[i].path);

                preview.append(`
                    <p>Icon</p>
                    <img src="base/games/${curFiles[i].name}_icon.png"></img>
                `);
                $('#gamesText').children('input').val(curFiles[i].name.replace('.exe', ''));

                sep_data = {
                    "name": curFiles[i].name.replace('.exe', ''),
                    "description": "",
                    "path": curFiles[i].path,
                    "thumb": ""
                }
                console.log(`[Game] ${sep_data}`);
            } else {
                preview.append(`
                    <p>File name ${curFiles[i].name}: Not a valid file type. Update your selection</p>
                `);
            }
        }
    }
}

input.addEventListener('change', updateImageDisplay);

$('#over-gi592n').on("click", function() {
    $('.expo-game-fT46of>.is-overlay').css('opacity', '0');
    $('.expo-game-fT46of>.gameview-add').css('opacity', '0');
    $('.expo-game-fT46of>.gameview-add').css('transform', 'scale(0.9, 0.9)');
    $('.expo-game-fT46of>.gameview-add').css('z-index', '-1');

    $('.expo-game-fT46of>.gameview-edit').css('opacity', '0');
    $('.expo-game-fT46of>.gameview-edit').css('transform', 'scale(0.9, 0.9)');
    $('.expo-game-fT46of>.gameview-edit').css('z-index', '-1');

    setTimeout(() => {
        $('.expo-game-fT46of>.is-overlay').css('display', 'none');
        $('.expo-game-fT46of>.gameview-add').css('display', 'none');

        $('.expo-game-fT46of>.gameview-edit').css('display', 'none');
    }, 600);
});

$('#close-Th6o7p').on("click", function() {
    $('.expo-game-fT46of>.is-overlay').css('opacity', '0');
    $('.expo-game-fT46of>.gameview-add').css('opacity', '0');
    $('.expo-game-fT46of>.gameview-add').css('transform', 'scale(0.9, 0.9)');
    $('.expo-game-fT46of>.gameview-add').css('z-index', '-1');

    setTimeout(() => {
        $('.expo-game-fT46of>.is-overlay').css('display', 'none');
        $('.expo-game-fT46of>.gameview-add').css('display', 'none');
    }, 600);
});

$('.game-add-F58dY4').on("click", function() {
    $('.expo-game-fT46of>.is-overlay').css('display', 'block');
    $('.expo-game-fT46of>.gameview-add').css('display', 'block');

    console.log(`[Game Add] Adicionando game`);

    setTimeout(() => {
        $('.expo-game-fT46of>.is-overlay').css('opacity', '0.85');
        $('.expo-game-fT46of>.gameview-add').css('opacity', '1');
        $('.expo-game-fT46of>.gameview-add').css('transform', 'scale(1.1, 1.1)');
        $('.expo-game-fT46of>.gameview-add').css('z-index', '10');
    }, 1);
});

function editgame() {
    console.log(`iiiiieeeeee OI?`);
    File.ReadFile('gamesDB.json', db => {
        var data = JSON.parse(db);

        for (let i = 0; i < data.games.length; i++) {
            if ($(this).parent().parent().children('.game-add-footer').children('.footer-title').text() == data.games[i].name) {
                indexedit = i;
                console.log(`[Game Edit] Editando: ${data.games[i].name}`);
                $('#gamesEditText').children('input').val(data.games[i].name);
            }
        }
    });

    $('.expo-game-fT46of>.is-overlay').css('display', 'block');
    $('.expo-game-fT46of>.gameview-edit').css('display', 'block');

    setTimeout(() => {
        $('.expo-game-fT46of>.is-overlay').css('opacity', '0.85');
        $('.expo-game-fT46of>.gameview-edit').css('opacity', '1');
        $('.expo-game-fT46of>.gameview-edit').css('transform', 'scale(1.1, 1.1)');
        $('.expo-game-fT46of>.gameview-edit').css('z-index', '10');
    }, 1);
}

function playAny(e) {
    switch (event.which) {
        case 1:
            var path = $(this).parent().parent().attr('path').split('\\');
            var Rpath = "";
            console.log(path);

            for (var i = 0; i < path.length - 1; i++) {
                Rpath += `${path[i]}\\`;
                console.log(Rpath);
            }
            process.chdir(Rpath);
            child.execFile(`./${path[path.length-1]}`, function(error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
            console.log('Left Mouse button pressed.');
            break;
        case 2:
            console.log('Middle Mouse button pressed.');
            break;
        case 3:
            console.log('Right Mouse button pressed.');
            break;
        default:
            console.log('You have a strange Mouse!');
    }
}

$('#close-hr03m6').on("click", function() {
    $('.expo-game-fT46of>.is-overlay').css('opacity', '0');
    $('.expo-game-fT46of>.gameview-edit').css('opacity', '0');
    $('.expo-game-fT46of>.gameview-edit').css('transform', 'scale(0.9, 0.9)');
    $('.expo-game-fT46of>.gameview-edit').css('z-index', '-1');

    setTimeout(() => {
        $('.expo-game-fT46of>.is-overlay').css('display', 'none');
        $('.expo-game-fT46of>.gameview-edit').css('display', 'none');
    }, 600);
});

$('.game-edit-Dg4jk0').on("click", editgame);
$('.game-options-Ao1t71').on('mousedown', playAny);

$('.comfirm-Te2Y93').on("click", function() {
    File.ReadFile('gamesDB.json', db => {
        var data = JSON.parse(db);
        if (data.games == undefined) {
            data.games = [];
        }

        if (sep_data.name == "" || sep_data.name == null) {
            return;
        }

        sep_data.name = $('#gamesText').children('input').val();
        sep_data.description = $('#gamesDesc').children('input').val();
        sep_data.thumb = $('#gamesThumb').children('input').val();

        data.games.push(sep_data);
        sep_data = {};

        $('.game-item-T5e87d').remove();
        for (let i = 0; i < data.games.length; i++) {
            $('.games-H5wY75').append(`
            <div class="game-item-T5e87d" path="${data.games[i].path}" index="${i}">
                <img src="${data.games[i].thumb}" alt=""></img>
                <div class="game-add-footer animation-default">
                    <span class="footer-title">${data.games[i].name}</span>
                    <span style='opacity: 0;' class="footer-descripition animation-default">${data.games[i].description}</span>
                </div>
                <div class="game-buttons-fThe32 animation-default">
                    <div class="game-options-Ao1t71">
                        <svg height="100%" version="1.1" viewBox="0 3 32 30" width="100%">
                            <use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytp-id-33"></use>
                            <path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-33"></path>
                        </svg>
                    </div>
                    <div class="game-edit-Dg4jk0">
                        <svg class="colorSelectedText-3YhFC6 icon-3tVJnl" xmlns="http://www.w3.org/2000/svg" viewBox="1 1 16 16">
                            <path d="M7.15546853,6.47630098e-17 L5.84453147,6.47630098e-17 C5.36185778,-6.47630098e-17 4.97057344,0.391750844 4.97057344,0.875 L4.97057344,1.9775 C4.20662236,2.21136254 3.50613953,2.61688993 2.92259845,3.163125 L1.96707099,2.61041667 C1.76621819,2.49425295 1.52747992,2.46279536 1.30344655,2.52297353 C1.07941319,2.58315171 0.88846383,2.73002878 0.77266168,2.93125 L0.117193154,4.06875 C0.00116776262,4.26984227 -0.0302523619,4.50886517 0.0298541504,4.73316564 C0.0899606628,4.9574661 0.236662834,5.14864312 0.437644433,5.26458333 L1.39171529,5.81583333 C1.21064614,6.59536289 1.21064614,7.40609544 1.39171529,8.185625 L0.437644433,8.736875 C0.236662834,8.85281521 0.0899606628,9.04399223 0.0298541504,9.2682927 C-0.0302523619,9.49259316 0.00116776262,9.73161606 0.117193154,9.93270833 L0.77266168,11.06875 C0.88846383,11.2699712 1.07941319,11.4168483 1.30344655,11.4770265 C1.52747992,11.5372046 1.76621819,11.5057471 1.96707099,11.3895833 L2.92259845,10.836875 C3.50613953,11.3831101 4.20662236,11.7886375 4.97057344,12.0225 L4.97057344,13.125 C4.97057344,13.6082492 5.36185778,14 5.84453147,14 L7.15546853,14 C7.63814222,14 8.02942656,13.6082492 8.02942656,13.125 L8.02942656,12.0225 C8.79337764,11.7886375 9.49386047,11.3831101 10.0774016,10.836875 L11.032929,11.3895833 C11.2337818,11.5057471 11.4725201,11.5372046 11.6965534,11.4770265 C11.9205868,11.4168483 12.1115362,11.2699712 12.2273383,11.06875 L12.8828068,9.93270833 C12.9988322,9.73161606 13.0302524,9.49259316 12.9701458,9.2682927 C12.9100393,9.04399223 12.7633372,8.85281521 12.5623556,8.736875 L11.6082847,8.185625 C11.7893539,7.40609544 11.7893539,6.59536289 11.6082847,5.81583333 L12.5623556,5.26458333 C12.7633372,5.14864312 12.9100393,4.9574661 12.9701458,4.73316564 C13.0302524,4.50886517 12.9988322,4.26984227 12.8828068,4.06875 L12.2273383,2.93270833 C12.1115362,2.73148712 11.9205868,2.58461004 11.6965534,2.52443187 C11.4725201,2.46425369 11.2337818,2.49571128 11.032929,2.611875 L10.0774016,3.16458333 C9.49400565,2.61782234 8.79351153,2.2117896 8.02942656,1.9775 L8.02942656,0.875 C8.02942656,0.391750844 7.63814222,6.47630098e-17 7.15546853,6.47630098e-17 Z M8.5,7 C8.5,8.1045695 7.6045695,9 6.5,9 C5.3954305,9 4.5,8.1045695 4.5,7 C4.5,5.8954305 5.3954305,5 6.5,5 C7.03043298,5 7.53914081,5.21071368 7.91421356,5.58578644 C8.28928632,5.96085919 8.5,6.46956702 8.5,7 Z" transform="translate(2.5 2)"></path>
                        </svg>
                    </div>
                </div>
            </div>
            `);
        }

        $('.game-edit-Dg4jk0').on("click", editgame);
        $('.game-options-Ao1t71').on('mousedown', playAny);

        console.log(`[Game Add] Adicionando: ${$('#gamesText').children('input').val()}`);

        $('.expo-game-fT46of>.is-overlay').css('opacity', '0');
        $('.expo-game-fT46of>.gameview-add').css('opacity', '0');
        $('.expo-game-fT46of>.gameview-add').css('transform', 'scale(0.9, 0.9)');
        $('.expo-game-fT46of>.gameview-add').css('z-index', '-1');

        setTimeout(() => {
            $('.expo-game-fT46of>.is-overlay').css('display', 'none');
            $('.expo-game-fT46of>.expo-game-fT46of>.gameview-add').css('display', 'none');
        }, 600);

        File.SaveFile('gamesDB.json', JSON.stringify(data));
    });
});

$('.comfirm-ht95e2').on("click", function() {
    File.ReadFile('gamesDB.json', db => {
        var data = JSON.parse(db);

        data.games[indexedit].name = $('#gamesEditText').children('input').val();

        $('.game-item-T5e87d').remove();
        for (let i = 0; i < data.games.length; i++) {
            $('.games-H5wY75').append(`
            <div class="game-item-T5e87d" path="${data.games[i].path}" index="${i}">
                <img src="${data.games[i].thumb}" alt=""></img>
                <div class="game-add-footer animation-default">
                    <span class="footer-title">${data.games[i].name}</span>
                    <span style='opacity: 0;' class="footer-descripition animation-default">${data.games[i].description}</span>
                </div>
                <div class="game-buttons-fThe32 animation-default">
                    <div class="game-options-Ao1t71">
                        <svg height="100%" version="1.1" viewBox="0 3 32 30" width="100%">
                            <use class="ytp-svg-shadow" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ytp-id-33"></use>
                            <path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-33"></path>
                        </svg>
                    </div>
                    <div class="game-edit-Dg4jk0">
                        <svg class="colorSelectedText-3YhFC6 icon-3tVJnl" xmlns="http://www.w3.org/2000/svg" viewBox="1 1 16 16">
                            <path d="M7.15546853,6.47630098e-17 L5.84453147,6.47630098e-17 C5.36185778,-6.47630098e-17 4.97057344,0.391750844 4.97057344,0.875 L4.97057344,1.9775 C4.20662236,2.21136254 3.50613953,2.61688993 2.92259845,3.163125 L1.96707099,2.61041667 C1.76621819,2.49425295 1.52747992,2.46279536 1.30344655,2.52297353 C1.07941319,2.58315171 0.88846383,2.73002878 0.77266168,2.93125 L0.117193154,4.06875 C0.00116776262,4.26984227 -0.0302523619,4.50886517 0.0298541504,4.73316564 C0.0899606628,4.9574661 0.236662834,5.14864312 0.437644433,5.26458333 L1.39171529,5.81583333 C1.21064614,6.59536289 1.21064614,7.40609544 1.39171529,8.185625 L0.437644433,8.736875 C0.236662834,8.85281521 0.0899606628,9.04399223 0.0298541504,9.2682927 C-0.0302523619,9.49259316 0.00116776262,9.73161606 0.117193154,9.93270833 L0.77266168,11.06875 C0.88846383,11.2699712 1.07941319,11.4168483 1.30344655,11.4770265 C1.52747992,11.5372046 1.76621819,11.5057471 1.96707099,11.3895833 L2.92259845,10.836875 C3.50613953,11.3831101 4.20662236,11.7886375 4.97057344,12.0225 L4.97057344,13.125 C4.97057344,13.6082492 5.36185778,14 5.84453147,14 L7.15546853,14 C7.63814222,14 8.02942656,13.6082492 8.02942656,13.125 L8.02942656,12.0225 C8.79337764,11.7886375 9.49386047,11.3831101 10.0774016,10.836875 L11.032929,11.3895833 C11.2337818,11.5057471 11.4725201,11.5372046 11.6965534,11.4770265 C11.9205868,11.4168483 12.1115362,11.2699712 12.2273383,11.06875 L12.8828068,9.93270833 C12.9988322,9.73161606 13.0302524,9.49259316 12.9701458,9.2682927 C12.9100393,9.04399223 12.7633372,8.85281521 12.5623556,8.736875 L11.6082847,8.185625 C11.7893539,7.40609544 11.7893539,6.59536289 11.6082847,5.81583333 L12.5623556,5.26458333 C12.7633372,5.14864312 12.9100393,4.9574661 12.9701458,4.73316564 C13.0302524,4.50886517 12.9988322,4.26984227 12.8828068,4.06875 L12.2273383,2.93270833 C12.1115362,2.73148712 11.9205868,2.58461004 11.6965534,2.52443187 C11.4725201,2.46425369 11.2337818,2.49571128 11.032929,2.611875 L10.0774016,3.16458333 C9.49400565,2.61782234 8.79351153,2.2117896 8.02942656,1.9775 L8.02942656,0.875 C8.02942656,0.391750844 7.63814222,6.47630098e-17 7.15546853,6.47630098e-17 Z M8.5,7 C8.5,8.1045695 7.6045695,9 6.5,9 C5.3954305,9 4.5,8.1045695 4.5,7 C4.5,5.8954305 5.3954305,5 6.5,5 C7.03043298,5 7.53914081,5.21071368 7.91421356,5.58578644 C8.28928632,5.96085919 8.5,6.46956702 8.5,7 Z" transform="translate(2.5 2)"></path>
                        </svg>
                    </div>
                </div>
            </div>
            `);
        }

        $('.game-edit-Dg4jk0').on("click", editgame);
        $('.game-options-Ao1t71').on('mousedown', playAny);

        console.log(`[Game Edit] Editado: ${data.games[indexedit].name}`);

        $('.expo-game-fT46of>.is-overlay').css('opacity', '0');
        $('.expo-game-fT46of>.gameview-edit').css('opacity', '0');
        $('.expo-game-fT46of>.gameview-edit').css('transform', 'scale(0.9, 0.9)');
        $('.expo-game-fT46of>.gameview-edit').css('z-index', '-1');

        setTimeout(() => {
            $('.expo-game-fT46of>.is-overlay').css('display', 'none');
            $('.expo-game-fT46of>.gameview-edit').css('display', 'none');
        }, 600);

        File.SaveFile('gamesDB.json', JSON.stringify(data));
    });
});