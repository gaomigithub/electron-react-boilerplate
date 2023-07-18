import React, { useCallback, useEffect } from 'react';
import './App.css';
import '@/styles/index.css';
import { useModeSwitcherStore } from '@/store/modeSwitcher';
import { Layout } from './pages/components/Layout';
import { useSelectorStore } from './store/selectorStore';
import { MessageType } from './main/messagetype';
import { SelectorStore } from './models/SelectorStore';
import { useSmartStepListStore } from './store/smartMode/stepList';
import { useSelectorTree } from './store/selectorTree';

function App() {
  const smartMode = useModeSwitcherStore((state) => state.smartMode);
  const setSelectors = useSelectorStore((state) => state.setSelectors);
  const addNewSelector = useSelectorStore((state) => state.addNewSelector);
  const addStep = useSmartStepListStore((state) => state.addStep);
  const setSelectedKeys = useSelectorTree((state) => state.setSelectedKeys);
  const setExpandKeys = useSelectorTree((state) => state.setExpandKeys);

  const handleMessageGet = useCallback(
    (_arg: unknown) => {
      const arg = _arg as { messageContent: any; messageType: MessageType };
      console.log('init effect: recived message', arg);

      switch (arg.messageType) {
        case MessageType.LocatorStoreTree: {
          let mySelectors: SelectorStore[] = [];
          mySelectors = JSON.parse(arg.messageContent);

          const res = mySelectors;
          setSelectors(res);
          console.log('init effect: set tree struc', { res });
          break;
        }
        case MessageType.NewLocator: {
          const callbackRes = addNewSelector(arg.messageContent);
          if (callbackRes.returnKey) {
            setSelectedKeys([callbackRes.returnKey]);
            if (callbackRes.parentKey) {
              setExpandKeys([callbackRes.parentKey]);
            }
          }

          if (smartMode) {
            addStep({
              type: 'click',
              folderName: callbackRes.parentName ?? ``,
              folderNameKey: callbackRes.parentKey ?? '',
              targetSelector: callbackRes.returnName ?? '',
              targetSelectorKey: callbackRes.returnKey ?? ``,
              locator: arg.messageContent.locator,
              screenshot: arg.messageContent.screenshot,
            });
          }
          console.log('init effect: added new selector');
          break;
        }
        default:
          break;
      }
    },
    [
      addNewSelector,
      addStep,
      setExpandKeys,
      setSelectedKeys,
      setSelectors,
      smartMode,
    ]
  );

  // 根据message处理selectors初始化&存储
  useEffect(() => {
    window.electron.ipcRenderer.on('ipc-example', handleMessageGet);
    return () => {
      window.electron.ipcRenderer?.removeAllListeners?.('ipc-example');
    };
  }, [
    addNewSelector,
    addStep,
    handleMessageGet,
    setExpandKeys,
    setSelectedKeys,
    setSelectors,
    smartMode,
  ]);

  return (
    <div className="App">
      <Layout />
    </div>
  );
}

export default App;
