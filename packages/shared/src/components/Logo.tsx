import React, { ReactElement } from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { LinkWithTooltip } from './tooltips/LinkWithTooltip';
import LogoText from '../svg/LogoText';
import LogoIcon from '../svg/LogoIcon';
import { webappUrl } from '../lib/constants';
import { IconSize } from './Icon';

const DevPlusIcon = dynamic(() =>
  import(/* webpackChunkName: "devPlusIcon" */ './icons').then(
    (mod) => mod.DevPlusIcon,
  ),
);

export enum LogoPosition {
  Absolute = 'absolute',
  Relative = 'relative',
  Initial = 'initial',
}

const logoPositionToClassName: Record<LogoPosition, string> = {
  [LogoPosition.Absolute]: classNames(
    'absolute left-1/2 top-4 mt-0.5 -translate-x-1/2',
    'laptop:relative laptop:left-[unset] laptop:top-[unset] laptop:mt-0 laptop:translate-x-[unset]',
  ),
  [LogoPosition.Relative]: classNames('relative mt-0.5', 'laptop:mt-0'),
  [LogoPosition.Initial]: '',
};

interface LogoSvgElemProps {
  className?: {
    container?: string;
    group?: string;
  };
  src?: string;
  isPlus?: boolean;
  fallback: typeof LogoText | typeof LogoIcon;
}

const LogoSvgElem = ({
  className,
  src,
  isPlus,
  fallback: FallbackElem,
}: LogoSvgElemProps): ReactElement => {
  if (src) {
    return (
      <img
        loading="eager"
        /* @ts-expect-error - Not supported by react yet */ /* eslint-disable react/no-unknown-property */
        fetchpriority="high"
        src={src}
        className={className?.container}
        alt="daily.dev logo"
      />
    );
  }
  return <FallbackElem isPlus={isPlus} className={className} />;
};

interface LogoProps {
  className?: string;
  logoClassName?: {
    container?: string;
    group?: string;
  };
  onLogoClick?: (e: React.MouseEvent) => unknown;
  hideTextMobile?: boolean;
  compact?: boolean;
  position?: LogoPosition;
  featureTheme?: {
    logo?: string;
    logoText?: string;
  };
  linkDisabled?: boolean;
  isPlus?: boolean;
}

export default function Logo({
  className,
  logoClassName = { container: 'h-logo' },
  onLogoClick,
  hideTextMobile = false,
  compact = false,
  position = LogoPosition.Absolute,
  featureTheme,
  linkDisabled,
  isPlus = false,
}: LogoProps): ReactElement {
  return (
    <LinkWithTooltip
      href={webappUrl}
      passHref
      prefetch={false}
      tooltip={{ placement: 'right', content: 'Home' }}
    >
      <a
        aria-disabled={linkDisabled}
        className={classNames(
          'relative flex items-center',
          logoPositionToClassName[position],
          className,
          linkDisabled && 'pointer-events-none',
        )}
        href={webappUrl}
        onClick={onLogoClick}
      >
        <div className="relative">
          <LogoSvgElem
            className={logoClassName}
            src={featureTheme?.logo}
            fallback={LogoIcon}
          />
          {isPlus && compact && (
            <DevPlusIcon
              className="absolute right-0 top-0 -translate-y-2/3 translate-x-2/3 text-action-plus-default"
              size={IconSize.XXSmall}
            />
          )}
        </div>
        {!compact && (
          <LogoSvgElem
            className={{
              container: classNames(
                'ml-1',
                logoClassName?.container,
                hideTextMobile && 'hidden laptop:block',
              ),
              group: logoClassName?.group,
            }}
            src={featureTheme?.logoText}
            isPlus={isPlus}
            fallback={LogoText}
          />
        )}
      </a>
    </LinkWithTooltip>
  );
}
