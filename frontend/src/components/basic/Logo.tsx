import { useState } from 'react';
import '../../scss/components/basic/Logo.scss';

// doAnimateOnHover: animates logo when hovered if set to true
// onClickLocation:  href location to redirect to when clicked
interface Props {
  doAnimateOnHover?: boolean;
  onClickLocation?: string;
}

const Logo: React.FC<Props> = function _({
  doAnimateOnHover = false,
  onClickLocation = '',
}) {
  const [hover, setHover] = useState<boolean>(false);

  const changeLocationFunction = () => {
    window.location.href = onClickLocation;
  };

  return (
    <button
      type="button"
      id="logo"
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      onClick={'' === onClickLocation ? () => {} : changeLocationFunction}
    >
      {Array(5)
        .fill(null)
        .map((__, index) => {
          return (
            <div
              key={index}
              id={`petal-${index}`}
              style={{
                animationIterationCount:
                  doAnimateOnHover && hover ? 'infinite' : '0',
              }}
            >
              <div className="petal-left-container">
                <div className="petal-left" />
              </div>
              <div className="petal-right-container">
                <div className="petal-right" />
              </div>
            </div>
          );
        })}
    </button>
  );
};

export default Logo;
