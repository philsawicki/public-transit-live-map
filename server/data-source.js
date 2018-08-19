'use strict';

const request = require('request');


/**
 * Get data for the given bus line.
 *
 * @param {string} service Identifier of the Service for which to get data.
 * @param {string} lineNumber Line number of the bus for which to get data.
 * @param {string} direction Direction of the bus for which to get data.
 * @return {Promise} A Promise to be fulfilled once the data for the given bus
 * becomes available.
 */
function getData(service, lineNumber, direction) {
    switch (service) {
        case 'STM':
            return getSTMData(lineNumber, direction);
        case 'STL':
            return getSTLData(lineNumber, direction);
        default:
            return Promise.reject(new Error(`Unkown Service "${service}".`));
    }
}

/**
 * Get data for the given STM bus line.
 *
 * @param {string} lineNumber Line number of the bus for which to get data.
 * @param {string} direction Direction of the bus for which to get data.
 * @return {Promise} A Promise to be fulfilled once the data for the given bus
 * becomes available.
 */
function getSTMData(lineNumber, direction) {
    const stmURL = `https://api.stm.info/pub/i3/v1c/api/fr/lines/${lineNumber}/positions/?direction=${direction}&wheelchair=0&o=web&_=${Date.now()}`;

    return new Promise((resolve, reject) => {
        function callback(error, response, body) {
            if (error) {
                reject(error);
            } else {
                try {
                    const parsedBody = JSON.parse(response.body);
                    resolve(parsedBody);
                } catch (ex) {
                    reject(ex);
                }
            }
        }

        const options = {
            url: stmURL,
            gzip: true,
            headers: {
                'Connection': 'keep-alive',
                'Origin': 'http://beta.stm.info'
            }
        };

        request(options, callback);
    });
}

/**
 * Get a unique transaction ID to be used for the next request when querying
 * the nextbus.com API.
 *
 * @param {string} lineNumber Line number of the bus for which to get data.
 * @param {string} direction Direction of the bus for which to get data.
 * @return {Promise} A Promise to be fulfilled once the key for the next
 * transaction has been found.
 */
function getKeyForNextTime(lineNumber, direction) {
    const url = `https://www.nextbus.com/googleMap/customGoogleMap.jsp?a=stl&r=${lineNumber}${direction}&lang=fr&s=CP41068&cssFile=https://www.stl.laval.qc.ca/skins/default/styles/nextbus.css`;

    return new Promise((resolve, reject) => {
        function callback(error, response, body) {
            if (error) {
                reject(error);
            } else {
                if (response.body) {
                    const keyForNextRegex = RegExp('keyForNextTime=\\"(\\d+)\\"', 'g');
                    const keyForNextRegexResult = keyForNextRegex.exec(response.body);
                    if (keyForNextRegexResult !== null) {
                        resolve(keyForNextRegexResult[1]);
                    }
                }
            }
        }

        const options = {
            url,
            gzip: true,
            headers: {
                'Connection': 'keep-alive',
                'Referer': `https://www.nextbus.com/googleMap/customGoogleMap.jsp?a=stl&r=${lineNumber}${direction}&lang=fr&s=41267&cssFile=https://www.stl.laval.qc.ca/skins/default/styles/nextbus.css`
            }
        };

        request(options, callback);
    });
}

/**
 * Get data for the given STL bus line.
 *
 * @param {string} lineNumber Line number of the bus for which to get data.
 * @param {string} direction Direction of the bus for which to get data.
 * @return {Promise} A Promise to be fulfilled once the data for the given bus
 * becomes available.
 */
async function getSTLData(lineNumber, direction) {
    const keyForNextTime = await getKeyForNextTime(lineNumber, direction);
    const stlURL = `https://www.nextbus.com/service/googleMapXMLFeed?command=vehicleLocations&a=stl&r=${lineNumber}${direction}&t=1533515051842&key=${keyForNextTime}&cnt=24`;

    return new Promise((resolve, reject) => {
        function callback(error, response, body) {
            if (error) {
                reject(error);
            } else {
                const parsedData = {};
                if (response.body) {
                    const vehiculeIDRegex = RegExp('(vehicle.id=\\"(\\d+)\\")', 'g');
                    const vehiculeIDRegexResult = vehiculeIDRegex.exec(response.body);
                    if (vehiculeIDRegexResult !== null) {
                        parsedData['vehicleID'] = vehiculeIDRegexResult[2];
                    }

                    const vehiculeLatRegex = RegExp('(lat=\\"(\\d+.\\d+)\\")', 'g');
                    const vehiculeLatRegexResult = vehiculeLatRegex.exec(response.body);
                    if (vehiculeLatRegexResult !== null) {
                        parsedData['vehicleLat'] = parseFloat(vehiculeLatRegexResult[2]);
                    }

                    const vehiculeLonRegex = RegExp('(lon=\\"(-\\d+.\\d+)\\")', 'g');
                    const vehiculeLonRegexResult = vehiculeLonRegex.exec(response.body);
                    if (vehiculeLonRegexResult !== null) {
                        parsedData['vehicleLon'] = parseFloat(vehiculeLonRegexResult[2]);
                    }

                    const vehiculeHeadingRegex = RegExp('(heading=\\"(\\d+)\\")', 'g');
                    const vehiculeHeadingRegexResult = vehiculeHeadingRegex.exec(response.body);
                    if (vehiculeHeadingRegexResult !== null) {
                        parsedData['vehicleHeading'] = parseInt(vehiculeHeadingRegexResult[2], 10);
                    }

                    const vehiculeSpeedRegex = RegExp('(speedKmHr=\\"(\\d+)\\")', 'g');
                    const vehiculeSpeedRegexResult = vehiculeSpeedRegex.exec(response.body);
                    if (vehiculeSpeedRegexResult !== null) {
                        parsedData['vehicleSpeed'] = vehiculeSpeedRegexResult[2];
                    }

                    const vehiculeLastUpdateRegex = RegExp('(lastTime.time=\\"(\\d+)\\")', 'g');
                    const vehiculeLastUpdateRegexResult = vehiculeLastUpdateRegex.exec(response.body);
                    if (vehiculeLastUpdateRegexResult !== null) {
                        parsedData['vehicleLastUpdate'] = parseInt(vehiculeLastUpdateRegexResult[2], 10);
                    }
                }

                resolve(parsedData);
            }
        }

        const options = {
            url: stlURL,
            gzip: true,
            headers: {
                'Connection': 'keep-alive',
                'Referer': `https://www.nextbus.com/googleMap/customGoogleMap.jsp?a=stl&r=${lineNumber}${direction}&lang=fr&s=41267&cssFile=https://www.stl.laval.qc.ca/skins/default/styles/nextbus.css`
            }
        };

        request(options, callback);
    });
}


module.exports = {
    getData,
    getSTLData,
    getSTMData
};
