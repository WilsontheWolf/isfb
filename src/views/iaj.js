/* eslint-env browser */
/* global Swal */

const div = document.getElementById('text');

const writeData = (data) => {
    div.innerHTML = data;
};

writeData('Loading...');
let loading = true;

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

const code = new URLSearchParams(window.location.search).get('code');

const regex = /\({0,1}_+\){0,1}/;
const regexGlobal = /\({0,1}_+\){0,1}/g;

const fillBlack = (black, white) => {
    if (!black.match(regex))
        black = `${black} <b>${white[0] || '___'}</b>`;
    else if (white)
        for (const s of white)
            black = black.replace(regex, `<b>${s.value}</b>`);
    else
        black = black.replace(regexGlobal, '<b>___</b>');
    return black;
};

const genScores = (players) => {
    let scores = {};
    for (const pid in players) {
        let { faction, points } = players[pid];
        scores[faction] = (scores[faction] || 0) + points;
    }
    return Object.entries(scores)
        .map(([key, value]) => `<br/><b>${key}</b>: ${value}`)
        .join('\n');
};

const loses = {
    cards: 'There were no cards submitted! No one wins this round.',
    czar: 'The czar didn\'t pick a card! No one wins this round.'
};

const handler = new Map();

handler.set('fatal', async (data) => {
    let msg = data.message || 'No message provided!';
    console.error(`Fatal Error occurred! ${msg}`);
    Toast.fire({
        icon: 'error',
        title: `Fatal Error occurred! ${msg}`
    });
    if (loading) {
        loading = false;
        writeData(`<b>A Fatal Error Occurred!</b><br>${msg}`);
    }
});

handler.set('info', async (data) => {
    let msg = data.message;
    if (!msg)
        return console.warn('Got info with no message!');
    Toast.fire({
        icon: 'info',
        title: msg
    });
});

handler.set('debug', async (data) => {
    let msg = data.message || data;
    console.log('[DEBUG][SERVER]', msg);
});

handler.set('end', ({ round, reason, scores }) => {
    writeData(`Game ended on round ${round}.${reason ? `<br/>${reason}` : ''}<br/><br/>The scores are:${Object.entries(scores)
        .map(([key, value]) => `<br/><b>${key}</b>: ${value}`)
        .join('\n')}<br/><br/>Thank You for playing!`);
});

handler.set('data', ({ data: {
    state,
    players,
    round,
    curBlack,
    win
} }) => {
    loading = false;
    if (state === 'waiting') {
        writeData(`Waiting with ${players.length} player${players.length === 1 ? '' : 's'}<br/>Join with code <code>${code}</code>.`);
    } else if (state === 'picking') {
        writeData(`Round: <b>${round}</b><br/>Picking<br/>${players.filter(p => !p.enabled || p.selected).length}/${players.length - 1} Players Picked<br/><br/>Black Card:<br/>${fillBlack(curBlack.value)}<br/><br/><br/>Join with code <code>${code}</code>.`);
    } else if (state === 'voting') {
        writeData(`Round: <b>${round}</b><br/>The czar is picking<br/><br/>Black Card:<br/>${fillBlack(curBlack.value)}<br/><br/><br/>Join with code <code>${code}</code>.`);
    } else if (state === 'displaying') {
        // Someone won
        if (win?.player) {
            let player = players.find(p => p.id === win.player);
            writeData(`Round: <b>${round}</b><br/><b>${win.tag}</b> won! (${player.faction})<br/><br/>Winning Card:<br/>${fillBlack(curBlack.value, player.selected)}<br/><br/>Scores:${genScores(players)}`);
        } else {
            writeData(`Round: <b>${round}</b><br/>${loses[win?.type] || 'Nobody won this round!'}<br/><br/>Scores:${genScores(players)}`);
        }
    } else console.error(`Unknown state "${state}"`);
});

(async () => {
    if (!code) {
        const { value: code } = await Swal.fire({
            title: 'No code provided',
            input: 'text',
            inputLabel: 'Please insert the game code.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            inputValidator: (value) => {
                if (!value)
                    return 'You need to write something!';
                if (value.includes(' '))
                    return 'Invalid code';
            }
        });
        window.location.href = `?code=${code}`;
    }

    const url = `ws${window.location.protocol === 'https:' ? 's' : ''}://${window.location.host}/iaj/${code}`;
    console.log(url);
    let last = null;

    const makeSocket = () => {
        const socket = new WebSocket(url);

        socket.addEventListener('open', () => {
            console.log('connected');
            Toast.fire({
                icon: 'success',
                title: `Connected to game ${code}.`
            });
        });

        socket.addEventListener('close', (event) => {
            console.log('disconnected');
            console.log(event);
            if (last.type !== 'fatal' && last.type !== 'end') {
                Toast.fire({
                    icon: 'error',
                    title: 'Disconnected.',
                    text: 'Attempting to reconnect...'
                });
                setTimeout(makeSocket, 1000);
            }
        });

        socket.addEventListener('message', async (event) => {
            console.log('Message from server', event.data);
            try {
                let msg = JSON.parse(event.data);
                last = msg;
                try {
                    const func = handler.get(msg.type);
                    if (!func)
                        return console.warn(`Unknown type "${msg.type}".`);
                    await func(msg, socket);
                } catch (e) {
                    console.error('Error handing data!', event.data, '\nError:', e);
                }
            } catch (e) {
                console.error('Invalid server msg!', event.data, '\nError:', e);
            }
        });
    };
    makeSocket();
})();