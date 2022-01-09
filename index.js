const middlewareHandler = async (arrayOFMiddlewares = []) => 
{
    if (!Array.isArray(arrayOFMiddlewares)) {
        throw new Error('please provide a array of middlewares functions')
    }
    let isNextActive = true;
    
    for (const middleware of arrayOFMiddlewares) 
    {
        try 
        {
            await middleware();
        } 
        catch (e) 
        {
            isNextActive = false;
            break;
        }
    }

    return isNextActive;
}

module.exports = middlewareHandler;