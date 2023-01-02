const config = {
    owners: ['517371142508380170', '312974985876471810', '278157010233589764'],

    blocked: process.env.BLOCKED?.split(',') || [],
    
    token: process.env.TOKEN,
};

module.exports = config;
