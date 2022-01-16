module.exports = function handleMiddleware() {
    return async (req, res) => {
        // set ip for express-rate-limit middleware
        if (!req.ip) req.ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
        try {
            let middlewares = [], options = {};
            // get arg in var
            for (const arg of arguments) {
                if (typeof arg == 'function') middlewares.push(arg);
                else if (typeof arg == 'object') {
                    if ('allowedMethods' in arg) 
                        middlewares.push(handleAllowMethods)
                    options = arg;
                }
            }
            function handleAllowMethods(req, res, next) 
            {
                const { allowedMethods = [] } = options;
                if (Array.isArray(allowedMethods) && allowedMethods.length > 0) {
                    let onlyAllowedMethods = [];
                    for (const method of allowedMethods)
                        if (typeof method == 'string') 
                            onlyAllowedMethods.push(method.toLowerCase())
                    
                    if (!onlyAllowedMethods.includes(req.method.toLowerCase())) {
                        res.status(404).send();
                    }
                    else next();
                } else next();
            }
            // handle middlewares
            if (middlewares[0] || req.method != "OPTIONS") 
            {
                function runNextFunction(func) 
                {
                    return new Promise(async (resolve, reject) => {
                        try {
                            await func(req, res, async function (result) {
                                if (result instanceof Error) return reject(result);
                                else return resolve();
                            })
                        } catch (error) 
                        {
                            console.log(error);
                            return reject(error);
                        }
                        finally { res.finished && reject(); }
                    })
                }
                for (const func of middlewares) {
                    try { await runNextFunction(func); } 
                    catch (e) { break; }
                }
            }
        } 
        catch (error) { console.log(error) }
    };    
}