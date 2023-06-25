import { memo, useMemo } from 'react';

export interface SvgIconProps {
  className?: string;
  SvgComponent?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  size?: 'small' | 'medium' | 'large';
  value?: number | { width: number; height: number };
}

export default memo(function SvgIcon(props: SvgIconProps) {
  const { className, SvgComponent, size, value = 12 } = props;

  const _size: number = useMemo(() => {
    let value = 24;
    switch (size) {
      case 'small':
        value = 16;
        break;
      case 'medium':
        value = 24;
        break;
      case 'large':
        value = 30;
        break;
      default:
        break;
    }
    return value;
  }, [size]);

  return SvgComponent ? (
    <SvgComponent
      fill="currentColor"
      fontSize="inherit"
      width={(typeof value === 'number' ? value : value.width) ?? _size}
      height={(typeof value === 'number' ? value : value.height) ?? _size}
      className={className}
    />
  ) : null;
});
