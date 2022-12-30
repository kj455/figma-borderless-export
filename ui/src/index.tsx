import { render } from 'solid-js/web';
import { App } from './App';
import './index.css';
import { createMessageClient } from './messageClient';

export const messageClient = createMessageClient(window);

window.onmessage = messageClient.onMessage;

render(() => <App />, document.getElementById('root')!);
