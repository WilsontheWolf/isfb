const { times } = require('./dbs');

/**
 * Convert a timezone to a float representing the current time in hours. Please validate the timezone before using this function.
 * @param {string} timezone - The timezone to convert to the current time. Does not verify if the timezone is valid.
 * @returns {number} The current time in hours. Minutes are converted to a decimal.
 */
const timezoneToCurrentTime = (timezone) => {
    const formatter = new Intl.DateTimeFormat('en-US', { timeStyle: 'short', hourCycle: 'h23', timeZone: timezone });
    let t = 0;

    formatter.formatToParts().forEach(p => {
        if (p.type === 'hour') t += parseInt(p.value);
        if (p.type === 'minute') t += parseInt(p.value) / 60;
    });

    return t;
};

/**
 * Convert a UTC offset to a timezone.
 * @param {number} offset - The UTC offset to convert to a timezone.
 * @returns {string} The timezone that matches the UTC offset.
 */
const convertOffsetToTimezone = (offset) => {
    const num = Math.abs(offset);
    const sign = offset > 0 ? '-' : '+'; // IANA timezones are backwards from UTC offsets
    const hours = Math.round(num);

    return `etc/gmt${sign}${hours}`;
};

/**
 * Convert a timezone to the current time. Please validate the timezone before using this function.
 * @param {string} timezone - The timezone to use. Does not verify if the timezone is valid.
 * @param {string} [locale] - The locale to use.
 * @returns {string} The current time in the specified timezone.
 */
const timezoneToDisplayTime = (timezone, locale = 'en-US') => {
    const formatter = new Intl.DateTimeFormat(locale, { timeStyle: 'short', timeZone: timezone });
    return formatter.format();
};

/**
 * Checks if a timezone is valid.
 * @param {string} timezone - The timezone to check.
 * @returns {({valid: boolean, msg: *?})} The results
 */
const validateTimezone = (timezone,) => {
    try {
        new Date().toLocaleString('en-US', { timeZone: timezone });
        return {
            valid: true,
            msg: null,
        };
    } catch (e) {
        return {
            valid: false,
            msg: e,
        };
    }
};

/**
 * Checks if the current time is between the start and end times.
 * @param {string} timezone - The timezone to check
 * @param {number} start - The start time in hours
 * @param {number} end - The end time in hours
 * @returns {boolean} Whether or not the current time is between the start and end times.
 */
const isPastBedtime = (timezone, start, end) => {
    const time = timezoneToCurrentTime(timezone);
    if (start < end) return time >= start && time <= end;
    else return time >= start || time <= end;
};

const timeRegex = /^(\d{1,2})(?:[:.](\d{1,2}))?(am|pm)?$/i;

/**
 * Convert a time string to hours.
 * @param {string} time - The time to convert to hours. Must be in the format of hh:mm or hh:mm am/pm.
 * @returns {number?} The time in hours. Minutes are converted to a decimal. Null if the time string is invalid.
 */
const convertTimeStringToHours = (time) => {
    const [, hours, minutes, ampm] = timeRegex.exec(time.replace(/\s/g, '')) || [];
    if (!hours) return null;
    let h = parseInt(hours);
    if (ampm) {
        if (h === 12) h = 0;
        if (ampm.toLowerCase() === 'pm') h += 12;
    }
    const m = parseInt(minutes) || 0;
    h = h + (m / 60);
    if (h >= 24) h -= 24;
    return h;
};

/**
 * Check if a user is past their bedtime and send them a message if they are.
 * @param {import('@projectdysnomia/dysnomia').GuildTextableChannel} channel - The Channel to send the message to
 * @param {import('@projectdysnomia/dysnomia').User} user - The user to send the message to
 * @param {string} [locale] - The locale to use
 */
const handleBedtimeCheck = async (channel, user, locale) => {
    const data = times.get(user.id);
    if (!data) return;
    let { offset, bedtime, lastAlert } = data;
    if (offset == undefined || !bedtime ) return;
    if (Date.now() - lastAlert < 600000) return;
    let timezone = data.offset;
    if (typeof data.offset === 'number') timezone = convertOffsetToTimezone(data.offset);
    if (!isPastBedtime(timezone, bedtime[0], bedtime[1])) return;
    if (!locale) locale = data.locale;

    const msg = {
        content: `Hey <@${user.id}>, It's past your set bedtime (\`${timezoneToDisplayTime(timezone, locale)}\`)! Make sure your getting enough sleep!`,
        allowedMentions: {
            users: [user.id]
        },
    };

    const res = await user.getDMChannel()
        .then(c => c.createMessage(msg))
        .catch(async () => {
            // Check if I can send to channel
            const perms = channel.permissionsOf(channel.client.user.id);
            if(!perms.has('sendMessages')  || !perms.has('viewChannel')) return null;
            await channel.createMessage(msg);
        })
        .catch(() => null);
    if (!res) return;
    times.set(user.id, Date.now(), 'lastAlert');


};



module.exports = {
    timezoneToCurrentTime,
    convertOffsetToTimezone,
    timezoneToDisplayTime,
    validateTimezone,
    isPastBedtime,
    convertTimeStringToHours,
    handleBedtimeCheck,
};