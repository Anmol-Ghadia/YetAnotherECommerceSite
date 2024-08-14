import '../../scss/components/basic/LeftButton.scss';

// {onclick} is a callback without parameters
// {rotation} is a number in degrees for direction of button,
//            clockwise from left
interface Props {
  onClick: () => void;
  rotation?: number;
}

// a themed button for this website.
const LeftButton: React.FC<Props> = function _({
  onClick,
  rotation = 0,
}) {
  return (
    <button
      type="button"
      style={{ rotate: `${rotation ? 0 : rotation}deg` }}
      className="theme-left-button"
      onClick={onClick}
      aria-label="back button"
    >
      <div className="theme-left-button-image" />
    </button>
  );
};

export default LeftButton;
