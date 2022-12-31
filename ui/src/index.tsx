import { render } from 'solid-js/web';
import { App } from './App';
import './index.css';
import { createMessageClient } from './messageClient';
import { forward } from '../../shared/utils';

export const messageClient = createMessageClient({ window, forward });

window.onmessage = messageClient.onMessage;

render(() => <App />, document.getElementById('root')!);
