import { ROUTES } from './mock-data.js'

const config = {
    minDelay: 300,
    maxDelay: 1200,
    errorRate: 0,
    isNetworkDown: false,
};

export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function makeResponse(status, data) {
    let body;
    if (data == null || status === 204) {
        body = null;
    } else { 
        body = JSON.stringify(data); 
    }

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
    };

    return new Response(body, {
        status,
        headers
    });
}

function findRoute(method, pathname) {
    const keys = Object.keys(ROUTES);

    for (let i = 0; i < keys.length; i++) {
        const [m, p] = keys[i].split(' ');
        if (m !== method) continue;

        const paramNames = [];
        const pattern = p.replace(/:([A-Za-z]+)/g, (_, name) => {
            paramNames.push(name);
            return '([^/]+)';
        })

        const match = pathname.match(new RegExp('^' + pattern + '$'))
        if (!match) continue;

        const params = {};
        paramNames.forEach((name, i) => params[name] = match[i + 1]);

        return { handler: ROUTES[keys[i]], params};

    }

    return null;
}

async function handle(url, init) {
    init = init || {}; //because of this dont have to write init?.field
    const method = (init.method || 'GET').toUpperCase();
    
    const parsedUrl = new URL(url, 'http://localhost');
    const pathname = parsedUrl.pathname;

    const query = Object.fromEntries(parsedUrl.searchParams.entries());

    let body = null;
    if (init.body) {
        try {
            body = JSON.parse(init.body);
        } catch {
            return makeResponse(400, { error: 'invalid json' });
        }
    }

    const delay = config.minDelay + Math.random() * (config.maxDelay - config.minDelay);
    await sleep(delay);

    if (config.isNetworkDown) throw new TypeError('failed to fetch');
    if (Math.random() < config.errorRate) return makeResponse(500, { error: 'error' });

    const route = findRoute(method, pathname);
    if (route == null) return makeResponse(404, { error: 'Обработчик не найден' });

    const result = route.handler(query, body, route.params);

    if (result && result.__reply === true) return makeResponse(result.status, result.data);
    if (result == null) return makeResponse(204);

    return makeResponse(200, result);
}

export function setupMockApi() {
    const realFetch = window.fetch.bind(window);

    window.fetch = function (input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (url.startsWith('/api/')) {
            return handle(url, init)
        } else {
            return realFetch(input, init);
        }
    };
}

export const mockApi = {
    config,
    setDelay(minDelay, maxDelay) {
        config.minDelay = minDelay;
        config.maxDelay = maxDelay;
    },
    setErrorRate(errorRate) {
        config.errorRate = errorRate;
    },
    setNetworkDown(networkDown) {
        config.isNetworkDown = networkDown;
    }
}