"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watch = void 0;
const tslib_1 = require("tslib");
const byline = require("byline");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const url_1 = require("url");
class Watch {
    constructor(config) {
        this.config = config;
    }
    // Watch the resource and call provided callback with parsed json object
    // upon event received over the watcher connection.
    //
    // "done" callback is called either when connection is closed or when there
    // is an error. In either case, watcher takes care of properly closing the
    // underlaying connection so that it doesn't leak any resources.
    async watch(path, queryParams, callback, done) {
        const cluster = this.config.getCurrentCluster();
        if (!cluster) {
            throw new Error('No currently active cluster');
        }
        const watchURL = new url_1.URL(cluster.server + path);
        watchURL.searchParams.set('watch', 'true');
        for (const [key, val] of Object.entries(queryParams || {})) {
            if (val !== undefined) {
                watchURL.searchParams.set(key, val.toString());
            }
        }
        const requestInit = await this.config.applyToFetchOptions({});
        const controller = new AbortController();
        requestInit.signal = controller.signal;
        requestInit.method = 'GET';
        let doneCalled = false;
        const doneCallOnce = (err) => {
            if (!doneCalled) {
                controller.abort();
                doneCalled = true;
                done(err);
            }
        };
        const stream = byline.createStream();
        stream.on('error', doneCallOnce);
        stream.on('close', () => doneCallOnce(null));
        stream.on('finish', () => doneCallOnce(null));
        stream.on('data', (line) => {
            try {
                const data = JSON.parse(line.toString());
                callback(data.type, data.object, data);
            }
            catch (ignore) {
                // ignore parse errors
            }
        });
        await (0, node_fetch_1.default)(watchURL, requestInit)
            .then((response) => {
            if (response.status === 200) {
                response.body.on('error', doneCallOnce);
                response.body.on('close', () => doneCallOnce(null));
                response.body.on('finish', () => doneCallOnce(null));
                response.body.pipe(stream);
            }
            else {
                const error = new Error(response.statusText);
                error.statusCode = response.status;
                throw error;
            }
        })
            .catch(doneCallOnce);
        return controller;
    }
}
exports.Watch = Watch;
Watch.SERVER_SIDE_CLOSE = { error: 'Connection closed on server' };
//# sourceMappingURL=watch.js.map