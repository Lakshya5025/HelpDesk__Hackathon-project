const processedKeys = new Map();

export const idempotencyCheck = (req, res, next) => {
    if (req.method !== 'POST') {
        return next();
    }

    const idempotencyKey = req.get('Idempotency-Key');

    if (!idempotencyKey) {
        return next();
    }

    if (processedKeys.has(idempotencyKey)) {
        const cachedResponse = processedKeys.get(idempotencyKey);
        return res.status(cachedResponse.status).json(cachedResponse.body);
    }

    const originalJson = res.json;
    res.json = (body) => {
        const responseToCache = {
            status: res.statusCode,
            body: body,
        };
        processedKeys.set(idempotencyKey, responseToCache);

        setTimeout(() => {
            processedKeys.delete(idempotencyKey);
        }, 24 * 60 * 60 * 1000);

        return originalJson.call(res, body);
    };

    next();
};