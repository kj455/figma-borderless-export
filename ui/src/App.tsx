import { filename } from './state';
import { createSignal, JSX, Index } from 'solid-js';
import { EXTENSION_LIST, SCALE_LIST } from '../../shared/constants';
import { Extension, Scale } from '../../shared/types';
import { messageClient } from '.';
import { FiMinus, FiPlus } from 'solid-icons/fi';

const focusStyle = 'focus:outline-none focus:ring focus:ring-blue-500';
const hoverStyle = 'hover:outline hover:outline-lightgray';

const defaultSetting = {
  scale: '1x' satisfies Scale,
  extension: 'png' satisfies Extension,
  suffix: '',
};

export const App = () => {
  const [settings, setSettings] = createSignal([defaultSetting]);

  const addSetting = () => {
    const [has1x, has2x, has3x] = (() => {
      let has1x = false;
      let has2x = false;
      let has3x = false;
      for (const s of settings()) {
        if (s.scale === '1x') has1x = true;
        if (s.scale === '2x') has2x = true;
        if (s.scale === '3x') has3x = true;
      }
      return [has1x, has2x, has3x];
    })();

    if (has1x) {
      if (has2x) {
        if (has3x) {
          return setSettings([{ ...defaultSetting, scale: '1x' }, ...settings()]);
        }
        return setSettings([{ ...defaultSetting, scale: '3x', suffix: '@3x' }, ...settings()]);
      }
      return setSettings([{ ...defaultSetting, scale: '2x', suffix: '@2x' }, ...settings()]);
    }
    return setSettings([{ ...defaultSetting, scale: '1x' }, ...settings()]);
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

  const handleSubmit = () => {
    messageClient.exportFromSettings({
      action: 'export',
      properties: settings().map((s) => ({
        scale: s.scale as Scale,
        ext: s.extension as Extension,
        suffix: s.suffix,
      })),
    });
  };

  return (
    <main class="min-h-screen w-screen bg-darkgray p-4 text-white">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold">Export</h2>
        <div class="flex gap-4">
          <button class="hover:bg-lightgray" onClick={removeSetting}>
            <FiMinus class="h-6 w-6 p-1" />
          </button>
          <button class="hover:bg-lightgray" onClick={addSetting}>
            <FiPlus class="h-6 w-6 p-1" />
          </button>
        </div>
      </div>

      <div class="mt-4" />

      <div class="flex flex-col gap-2">
        <Index each={settings()}>
          {(setting, i) => (
            <div class="flex w-full justify-between text-xs">
              <select
                class={`-ml-2 bg-transparent p-1 ${hoverStyle} ${focusStyle}`}
                value={setting().scale}
                onInput={handleInput('scale', i)}
              >
                {SCALE_LIST.map((scale) => (
                  <option value={scale}>{scale}</option>
                ))}
              </select>
              <input
                placeholder="Suffix"
                class={`w-16 bg-transparent p-1 ${hoverStyle} ${focusStyle}`}
                value={setting().suffix}
                onInput={handleInput('suffix', i)}
              />
              <select
                class={`bg-transparent p-1 ${hoverStyle} ${focusStyle}`}
                value={setting().extension}
                onInput={handleInput('extension', i)}
              >
                {EXTENSION_LIST.map((ext) => (
                  <option value={ext}>{ext}</option>
                ))}
              </select>
            </div>
          )}
        </Index>
      </div>

      <div class="mt-4" />

      <button class="w-full rounded-md border border-white/80 p-2 text-xs" onClick={handleSubmit}>
        Export {filename()}
      </button>
    </main>
  );
};
