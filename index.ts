function handleMiddleware() {
    return async (req, res) => {
        // set ip for express-rate-limit middleware
        if (!req.ip) req.ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
        try {
            let middlewares = [], options:any = {};
            // get arg in var
            for (const arg of arguments) {
                if (typeof arg == 'function') middlewares.push(arg);
                else if (typeof arg == 'object') options = arg;
            }
            const { allowedMethods = [] } = options;

            // // 1- Handle allowedMethods option
            if (Array.isArray(allowedMethods) && allowedMethods.length > 0)
                // add handleAllowMethods function before last callback to run after cors if exist
                middlewares.splice(middlewares.length - 1, 0, handleAllowMethods)
            function handleAllowMethods(req, res, next, stop) {
                let onlyAllowedMethods = [];
                for (const method of allowedMethods)
                    if (typeof method == 'string') 
                        onlyAllowedMethods.push(method.toLowerCase())
                
                if (!onlyAllowedMethods.includes(req.method.toLowerCase())) {
                    res.status(404).send();
                    stop();
                }
                else next();
            }

            // handle middlewares
            if (middlewares[0] || req.method != "OPTIONS") 
            {
                function runNextFunction(func) 
                {
                    return new Promise<void>(async (resolve, reject) => {
                        let isCallbackRun = false;
                        await func(req, res, async function (result) {
                            isCallbackRun = true;
                            if (result instanceof Error) return reject(result);
                            else return resolve();
                        })
                        if (!isCallbackRun) reject();
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
export = handleMiddleware;