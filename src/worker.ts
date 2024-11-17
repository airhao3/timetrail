export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        console.log(`${request.method} ${request.url}`);
        
        try {
            if (request.method === 'OPTIONS') {
                return new Response(null, { 
                    headers: corsHeaders(env.CORS_ORIGIN) 
                });
            }

            const db = new Database(env.DB);
            const url = new URL(request.url);
            const userId = request.headers.get('X-User-Id');

            if (!userId) {
                return new Response('Unauthorized', { 
                    status: 401,
                    headers: corsHeaders(env.CORS_ORIGIN)
                });
            }

            const routes = {
                '/projects': {
                    GET: async () => await db.getProjects(userId),
                    POST: async () => {
                        const data = await request.json();
                        return await db.createProject({ ...data, user_id: userId });
                    }
                },
                '/tasks': {
                    GET: async () => await db.getTasks(userId),
                    POST: async () => {
                        const data = await request.json();
                        return await db.createTask({ ...data, user_id: userId });
                    }
                }
            };

            const route = routes[url.pathname];
            if (route && route[request.method]) {
                const result = await route[request.method]();
                return jsonResponse(result, env.CORS_ORIGIN);
            }

            return new Response('Not Found', { 
                status: 404,
                headers: corsHeaders(env.CORS_ORIGIN)
            });

        } catch (err) {
            console.error('Worker error:', err);
            return new Response(
                JSON.stringify({
                    error: err instanceof Error ? err.message : '服务器错误',
                    timestamp: new Date().toISOString()
                }), 
                { 
                    status: 500,
                    headers: {
                        ...corsHeaders(env.CORS_ORIGIN),
                        'Content-Type': 'application/json'
                    }
                }
            );
        }
    }
}