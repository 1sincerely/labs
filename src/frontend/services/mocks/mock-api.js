import { ROUTES } from 'mock-data.js'

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
    const route = Object.keys(ROUTES).find((m) => {
        const [routeMethod, routePathname] = m.split(' ');
        return routeMethod === method && routePathname === pathname;
    });
    if (route == null) return null;

    const handler = ROUTES[route];
    const params = {};

    return { handler, params };
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

    return makeResponse(200, { method, pathname, query, body});
}