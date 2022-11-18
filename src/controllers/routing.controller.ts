import { qs } from "../helpers";

export default class RoutingController {

    private app_div: HTMLDivElement;    
    private routes: any;
    private templates: any;

    constructor() {
        this.app_div = qs('#app') as HTMLDivElement;
        this.routes = [];
        this.templates = [];
    }


    route(path: string, template: string) {
        if (typeof template === 'function') {
            return this.routes[path] = template;
        }
        else if (typeof template === 'string') {
            return this.routes[path] = this.templates[template];
        } else {
            return;
        };
    };

    template(name: string, templateFunction: string) {
        return this.templates[name] = templateFunction;
    };

    home() {
        const div = document.createElement('div');
        const link = document.createElement('a');
        link.href = '#/about';
        link.innerText = 'About';

        div.innerHTML = '<h1>Home</h1>';
        div.appendChild(link);

        this.app_div.appendChild(div);
    };

    about() {
        const div = document.createElement('div');
        const link = document.createElement('a');
        link.href = '#/';
        link.innerText = 'Home';

        div.innerHTML = '<h1>About</h1>';
        div.appendChild(link);

        this.app_div.appendChild(div);
    };

    resolveRoute(route:string) {
        try {
            return this.routes[route];
        } catch (e) {
            throw new Error(`Route ${route} not found`);
        };
    };
}