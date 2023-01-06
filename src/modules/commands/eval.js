const { Constants } = require('@projectdysnomia/dysnomia');
const { embedColours } = require('../constants');

const sharedRegex = '(?=^\\w|$|[^a-zA-Z0-9_\'".)\\]\\-+;:/%\\]\\w|[^a-zA-Z0-9_\'".)\\]\\-+;:/%\\\\])';
const colourRegex = new RegExp('(?:^.+?)' + sharedRegex, 'i');

/**
 * @param {import('@projectdysnomia/dysnomia').CommandInteraction | import('@projectdysnomia/dysnomia').ModalSubmitInteraction} interaction 
 * @param {string} code 
 * @param {boolean?} hidden 
 */
const handleEval = async (interaction, code, hidden) => {
    const embed = {
        footer: {
            text: `Eval command executed by ${interaction.user?.username || 'Unknown'}`
        },
        timestamp: new Date().toISOString(),
        fields: [],
    };
    let response;
    let e = false;
    try {
        if (code.includes('await') && !code.includes('\n'))
            code = '( async () => {return ' + code + '})()';
        else if (code.includes('await') && code.includes('\n'))
            code = '( async () => {' + code + '})()';
        response = await eval(code);
        if (typeof response !== 'string') {
            response = require('util').inspect(response, { depth: 3 });
        }
    } catch (err) {
        e = true;
        response = err.toString();
        try {
            const Linter = require('eslint').Linter;
            let linter = new Linter();
            let lint = linter.verify(code, { 'env': { 'commonjs': true, 'es2021': true, 'node': true }, 'extends': 'eslint:recommended', 'parserOptions': { 'ecmaVersion': 12 } });
            let error = lint.find(e => e.fatal);
            if (error) {
                let line = code.split('\n')[error.line - 1];
                let match = line.slice(error.column - 1).match(colourRegex);
                let length = error.endColumn || (match?.[0].length ?? 1);
                const lineLength = line.length;
                if (lineLength >= 50)
                    line = line
                        .replace(
                            new RegExp(
                                `^.{${Math.floor(error.column / 2)},${error.column
                                }}?${sharedRegex}`
                            ),
                            '$`'
                        )
                        .trimStart();
                const cutLength = lineLength - line.length;
                // Insert ansi escape codes to make the error message pop out
                // Do the closing one first so it doesn't mess up the length
                line = line.split('');
                line.splice(error.column - 1 - cutLength + length, 0, '\u001b[0m');
                line.splice(error.column - 1 - cutLength, 0, '\u001b[1;34m');
                line = line.join('');
                response = `ansi\n${line}
\u001b[1;31m${' '.repeat(error.column - 1 - cutLength)}${'^'.repeat(length)}
[${error.line}:${error.column}] ${error.message}\u001b[0m`;
            }
        } catch (e) { }
    }
    const length = `\`\`\`${response}\`\`\``.length;
    embed.title = e ? '**Error**' : '**Success**';
    embed.color = e ? embedColours.RED : embedColours.GREEN;
    embed.description = `\`\`\`${response.substr(0, 4090)}\`\`\``;
    if (length >= 4097) {
        console.log(`An eval command executed by ${interaction.user?.username || 'Unknown'}'s response was too long (${length}/4096) the response was:
${response}`);
        embed.fields.push({ name: 'Note:', value: `The response was too long with a length of \`${length}/4096\` characters. it was logged to the console` });
    }
    if (!interaction.acknowledged) await interaction.createMessage({ embeds: [embed], flags: hidden ? Constants.MessageFlags.EPHEMERAL : 0 });
    else interaction.createFollowup({ embeds: [embed], flags: hidden ? Constants.MessageFlags.EPHEMERAL : 0 });
};

exports.handleEval = handleEval;