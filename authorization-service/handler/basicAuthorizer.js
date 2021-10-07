'use strict';

export const basicAuthorizer  = async (event, context, callback) => {
    console.log("**********Get logs of event: ", event);

    if (event.type !== 'TOKEN') {
        callback('Unauthorized')
    };

    try {
        const encoded = event.authorizationToken.split(' ')[1];
        const buff = Buffer.from(encoded, 'base64');
        const [ username, password ] = buff.toString('utf-8').split(':');
        const storedPassword = process.env[username];
        console.log(`********CHECK PASSWORD: ${storedPassword}`);
        const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';
        succeed(generatePolicy(encoded, event.methodArn, effect));
    } catch (e) {
        callback(`Unauthorized: ${e.message}`);
    }
};

const generatePolicy = (principalId, resource, effect) => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Resource: resource,
                Effect: effect,
            }
        ]
    }
});



