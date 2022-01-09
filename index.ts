const middlewareHandler = async (arrayOFMiddlewares: Array<Function> = []) => 
{
    if (!Array.isArray(arrayOFMiddlewares)) {
        throw new Error('please provide an array of middlewares functions')
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

export = middlewareHandler;