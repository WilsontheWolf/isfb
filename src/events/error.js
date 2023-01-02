/**
 * @param {import('@projectdysnomia/dysnomia').Client} client 
 */
module.exports = async (client, e) => {
    console.error(
        `An error occurred: \n${e?.stack || e}`
    );
};
