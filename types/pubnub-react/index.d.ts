// Type definitions for pubnub-react 1.2
// Project: https://github.com/pubnub/react#readme
// Definitions by: My Self <https://github.com/me>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export = pubnub_react;

declare class pubnub_react {
    constructor(config: any);

    getOriginalInstance(): any;

    init(component: any): void;

    subscribe(args: any): void;

    unsubscribe(args: any): void;

}

declare namespace pubnub_react {
    // @ts-ignore
    namespace prototype {
        function getOriginalInstance(): any;

        function init(component: any): void;

        function subscribe(args: any): void;

        function unsubscribe(args: any): void;

        namespace getOriginalInstance {
            const prototype: {
            };

        }

        namespace init {
            const prototype: {
            };

        }

        namespace subscribe {
            const prototype: {
            };

        }

        namespace unsubscribe {
            const prototype: {
            };

        }

    }

}

