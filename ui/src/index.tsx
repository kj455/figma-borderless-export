import { createSignal, JSX, Component, Index } from 'solid-js';
import { render } from 'solid-js/web';
import './index.css';
import { filename } from './state';

const blueFocusRing = 'focus:outline-none focus:ring focus:ring-blue-500';

const scaleOptions = ['0.5x', '0.75x', '1x', '1.5x', '2x', '3x', '4x'] as const;
const extensionOptions = ['PNG', 'JPG'] as const;

const Spacer: Component<{ x?: number; y?: number }> = ({ x, y }) => {
  return <div class={`${x != null ? `mr-${x}` : ''} ${y != null ? `mt-${y}` : ''} flex-grow`.trim()} />;
};

const defaultSetting = {
  scale: '1x' satisfies typeof scaleOptions[number],
  extension: 'PNG' satisfies typeof extensionOptions[number],
  suffix: '',
};

const App = () => {
  const [settings, setSettings] = createSignal([defaultSetting]);

  const addSetting = () => {
    setSettings([defaultSetting, ...settings()]);
  };

  const removeSetting = () => {
    setSettings([...settings()].slice(1));
  };

  const handleInput: (
    type: 'scale' | 'suffix' | 'extension',
    i: number,
  ) => JSX.EventHandler<HTMLSelectElement | HTMLInputElement, InputEvent> = (type, i) => (e) => {
    const newSettings = [...settings()];
    newSettings[i] = { ...newSettings[i], [type]: e.currentTarget.value };
    setSettings(newSettings);
  };

  return (
    <main class="min-h-screen w-screen bg-darkgray p-4 text-white">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold">Export</h2>
        <div class="flex gap-2">
          <button class="w-6 hover:bg-lightgray" onClick={removeSetting}>
            -
          </button>
          <button class="w-6 hover:bg-lightgray" onClick={addSetting}>
            +
          </button>
        </div>
      </div>

      <div class="mt-4" />

      <div class="flex flex-col gap-2">
        <Index each={settings()}>
          {(setting, i) => (
            <div class="flex w-full justify-between text-xs">
              <select
                class={`-ml-2 bg-transparent p-1 hover:outline hover:outline-lightgray ${blueFocusRing}`}
                value={setting().scale}
                onInput={handleInput('scale', i)}
              >
                {scaleOptions.map((scale) => (
                  <option value={scale}>{scale}</option>
                ))}
              </select>
              <input
                placeholder="Suffix"
                class={`w-16 bg-transparent p-1 hover:outline hover:outline-lightgray ${blueFocusRing}`}
                value={setting().suffix}
                onInput={handleInput('suffix', i)}
              />
              <select
                class={`bg-transparent p-1 hover:outline hover:outline-lightgray ${blueFocusRing}`}
                value={setting().extension}
                onInput={handleInput('extension', i)}
              >
                {extensionOptions.map((ext) => (
                  <option value={ext}>{ext}</option>
                ))}
              </select>
            </div>
          )}
        </Index>
      </div>

      <div class="mt-4" />

      <button class="w-full rounded-md border border-white/80 p-2 text-xs" onClick={() => console.log(settings())}>
        Export {filename()}
      </button>
    </main>
  );
};

render(() => <App />, document.getElementById('root')!);
