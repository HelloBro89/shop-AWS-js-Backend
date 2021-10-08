'use strict';

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

export const basicAuthorizer  = async (event, context, callback) => {
    console.log("**********Get logs of event: ", event);

    if (event.type !== 'TOKEN') {
        callback('Unauthorized')
    };

    try {
        const encoded = event.authorizationToken.split(' ')[1];
        console.log(`******CHECK encoded: ${encoded}`);
        const buff = Buffer.from(encoded, 'base64');
        console.log(`********CHECK BUFF: ${buff}`);
        const [ username, password ] = buff.toString('utf-8').split(':');
        const storedPassword = process.env[username];
        console.log(`********CHECK username: ${username}`);
        console.log(`********CHECK storedPassword: ${storedPassword}`);
        console.log(`********CHECK PASSWORD: ${password}`);
        const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';
        console.log(`********CHECK EFFECT: ${effect}`);
        const policy = generatePolicy(encoded, event.methodArn, effect);
        console.log(`CHECK POLICY: ${JSON.stringify(policy)}`);
        callback(null, policy);
    } catch (e) {
        console.log(`*******CHECK ERROR ${e}`);
        callback(`Unauthorized: ${e.message}`);
    }
};




