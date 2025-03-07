/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useSmartStepListStore } from '@/store/smartMode/stepList';
import { memo, useMemo } from 'react';
import { StepItem } from '@/models/StepList';
import { Space } from 'antd';
import { StepItemContent } from './StepItemContent';

export function useSmartModeStepList(items: StepItem[]) {
  const steps = useMemo(() => {
    return items.map((item, index) => {
      return {
        icon: (
          // Step序号
          <div
            css={css`
              width: 16px;
              height: 16px;
              background: #3377ff;
              border-radius: 50%;
              display: flex;
              flex: 1;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin: 8px 6px;
              position: relative;
            `}
          >
            <span
              css={css`
                flex: 1;
                font-size: 12px;
                line-height: 16px;
                color: #ffffff;
              `}
            >
              {index + 1}
            </span>
            {index !== items.length - 1 && (
              <div
                css={css`
                  width: 0px;
                  height: 60px;
                  top: 16px;
                  border: 1px solid #aebcf3;
                  position: absolute;
                `}
              />
            )}
          </div>
        ),
        content: <StepItemContent index={index} item={item} />,
      };
    });
  }, [items]);
  return {
    steps,
  };
}

export const StepListContainer = memo(() => {
  const stepItems = useSmartStepListStore((state) => state.stepItems); // TODO：现在stepItems与selectors的数据来源是相互独立的，但理论上stepItems[x]中的 folderName与targetSelector应和selectors中的数据存在某种联动，达成修改后会相互联动修改；
  //   const setStepItems = useSmartStepListStore(
  //     (state) => state.setStepItems
  //   );

  const { steps } = useSmartModeStepList(stepItems);

  const StepDom = useMemo(() => {
    return steps.map((item, key) => {
      const _key = key;
      return (
        <div
          key={_key}
          css={css`
            display: flex;
            flex: 1;
            flex-direction: row;
            div {
              display: flex;
            }
            .step-item-icon {
              flex: 0 0 auto;
            }
            .step-item-content {
              flex: 1;
            }
          `}
        >
          <div className="step-item-icon">{item.icon}</div>
          <div className="step-item-content">{item.content}</div>
        </div>
      );
    });
  }, [steps]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        flex: 1;
        width: 100%;
        height: 100%;
        min-height: 0px;
        max-height: 485px;
        margin-top: 16px;
        .ant-space-item {
          display: flex;
          flex: 1;
        }
        overflow: auto;
      `}
    >
      <Space size={4} direction="vertical">
        {StepDom}
      </Space>
    </div>
  );
});
