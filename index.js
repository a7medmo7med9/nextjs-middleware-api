function handleMiddleware() {
    return async (req, res) => {
        // set ip for express-rate-limit middleware
        if (!req.ip) req.ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
        try {
            let middlewares = [], options = {};
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
            let index = 0;
            if (middlewares[index] || req.method != "OPTIONS") {
                // 1- check for callback function
                if (middlewares.length <= 0) throw new Error('please provide a callback function')
                // 2- run function and wait for callback to run next function
                await runNextFunction(middlewares[index]);
                function runNextFunction(func) {
                    return new Promise((resolve) => {
                        func(req, res, async function (result) {
                            if (result instanceof Error) resolve();
                            else {
                                index++;
                                if (middlewares[index]) {
                                    resolve();
                                    await runNextFunction(middlewares[index])
                                }
                                else resolve()
                            }
                        }, () => resolve())
                    })
                }
            }
        } 
        catch (error) { console.log(error) }
    };    
}
module.exports = handleMiddleware;