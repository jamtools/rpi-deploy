import {context as build} from 'esbuild';

setTimeout(async () => {
    const ctx = await build({
        bundle: true,
        platform: 'node',
        entryPoints: ['./src/index.ts'],
        outfile: 'dist/index.js',
    });

    await ctx.watch();

    await ctx.serve({
        // host: 'jam.local',
        port: 1380,
    });

    console.log('http://jam.local:1380');
});
