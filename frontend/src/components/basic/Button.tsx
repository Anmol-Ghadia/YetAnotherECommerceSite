import '../../scss/components/basic/Button.scss';

// fill:    boolean that fills the button if true
// onClick: is a callback without parameters
// content: content of the button body
interface Props {
  fill?: boolean;
  onClick?: () => void;
  content?: React.ReactNode;
}

// a themed button for this website.
const Button: React.FC<Props> = function _({
  fill = false,
  onClick = () => {},
  content = '',
}) {
  return (
    <button
      type="button"
      data-fill-button={fill ? '1' : '0'}
      className="theme-button"
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default Button;
