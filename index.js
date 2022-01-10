const cors = require('cors')

function routerHandler()
{
    return async (req, res) => 
    {
        
        try 
        {
            // check for arg
            if (arguments.length <= 0) {
                throw new Error('please provide a callback function')
            }


            let middlewares = [];
            let options = {}
            // get arg in var
            for (const arg of arguments) 
            {
                switch (typeof arg) 
                {
                    case 'function':
                        middlewares.push(arg)
                        break;
                    case 'object':
                        options = arg
                        break;
                }
            }

            // handle cors and allowedMethods
            // 1- check if options not empty to run cors check
            if (options && Object.keys(options).length != 0) 
            {
                // Handle allowedMethods
                const { allowedMethods } = options;
                if (Array.isArray(allowedMethods) && allowedMethods.length > 0) 
                {
                    let onlyAllowedMethods = [];
                    for (const method of allowedMethods) {
                        if (typeof method == 'string') {
                            onlyAllowedMethods.push(method.toLowerCase())
                        }
                    }

                    if (!onlyAllowedMethods.includes(req.method.toLowerCase())) {
                        return res.status(404).send();
                    }
                }

                // Handle cors
                cors(options)(req, res, function (result) {
                    if (result instanceof Error) {
                        return result;
                    }
                    return result;
                })
            }
            /*******************************************************************************/


            // handle middlewares
            // 1- check for callback
            if (middlewares.length <= 0) throw new Error('please provide a callback function')
            // 2- run function and wait for callback to run next function
            let index = 0;
            await runNextFunction(middlewares[index]);
            function runNextFunction(func) {
                return new Promise((resolve) =>  {
                    func(req, res, async function (result) {
                        if (result instanceof Error) {
                            resolve();
                        }
                        else 
                        {
                            index++;
                            if (middlewares[index]) {
                                resolve();
                                await runNextFunction(middlewares[index])
                            }
                            else resolve()
                        }
                    }, function() {
                        resolve()
                    })
                })
            }
        } 
        catch (error) 
        {
            console.log(error);
        }
    };
        
}

module.exports = routerHandler;