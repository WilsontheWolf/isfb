const Enmap = require('enmap');
const config = require('../config');

/** @type {import('@projectdysnomia/dysnomia').Client} */
let client;

const setClient = (c) => {
    client = c;
};

const getClient = () => {
    return client;
};

// This is here, mostly cause its needed by a few functions.
const commands = new Enmap();
const components = new Enmap();

const loadCommand = commandName => {
    try {
        console.log(`Loading Command: ${commandName}`);
        const props = require(`../commands/${commandName}`);
        if (props.bot.privileged)
            props.slash.description += ' (Developer Only)';
        commands.set(props.slash.name + props.slash.type, props);
        return false;
    } catch (e) {
        return `Unable to load command ${commandName}: \n${e.stack}`;
    }
};

const loadComponent = componentName => {
    try {
        console.log(`Loading Component: ${componentName}`);
        const props = require(`../components/${componentName}`);
        components.set(props.data.name + props.data.type, props);
        return false;
    } catch (e) {
        return `Unable to load component ${componentName}: \n${e.stack}`;
    }
};

/**
 * Gets random item(s) from an array
 * @param {Array} arr - Array to get random item from
 * @param {number} [length=1] - Number of items to get
 * @param {boolean} [unique=false] - Whether or not to get unique items
 * @returns {any|Array} - Returns a single item if length is 1, otherwise returns an array of items
 */
const randFromArray = (arr, length = 1, unique = false) => {
    let newArr = [];
    if (unique) {
        if (arr.length < length) newArr = arr;
        else while (newArr.length < length) {
            const rand = arr[Math.floor(Math.random() * arr.length)];
            if (!newArr.includes(rand)) newArr.push(rand);
        }
    } else {
        for (let i = 0; i < length; i++) {
            newArr.push(arr[Math.floor(Math.random() * arr.length)]);
        }
    }
    if (newArr.length === 1) return newArr[0];
    return newArr;
};

/**
 * Checks if a user is a privileged user
 * @param {string} user - User ID to check
 * @returns {boolean} - Whether or not the user is a privileged user
 */
const isPrivileged = (user) => {
    return config.owners.includes(user);
};

module.exports = {
    loadCommand,
    loadComponent,
    setClient,
    getClient,
    randFromArray,
    isPrivileged,
    commands,
    components,
};