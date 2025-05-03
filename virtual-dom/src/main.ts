import './style.css'
import { createElement } from './virtual-dom/create-element'
import { diff } from './virtual-dom/diff';
import { mount } from './virtual-dom/mount';
import { render } from './virtual-dom/render';

const createVApp = (count: number) => createElement("div", {
    attrs: { id: "app" },
    children: [
        "The current count is ",
        String(count),
        ...Array.from({ length: count }, () => createElement('img', {
            attrs: {
                src: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTdneTI1NzI4OXMyOTA2czRzOGVhNmhkaDMyamd1ajRrZG1jMDhyeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lJ98Us9hMJU5dHANtk/giphy.gif",
            },
        })),
    ]
});

let vApp = createVApp(0);
const $app = render(vApp);
console.log($app);

let $rootElement = mount($app as Element, document.getElementById("app")!);

setInterval(() => {
    const newVApp = createVApp(Math.floor(Math.random() * 15));
    const patch = diff(vApp, newVApp);

    patch($rootElement);
    vApp = newVApp;
}, 1000);