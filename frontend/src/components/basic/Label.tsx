import '../../scss/components/basic/Label.scss';

// content:         the content of the label, could also be jsx
// center:          boolean for centering the label in available space
// allowUserSelect: boolean to allow users to select the content
interface Props {
  content?: React.ReactNode;
  center?: boolean;
  allowUserSelect?: boolean;
}

// represents a text displaued to user
const Label: React.FC<Props> = function _({
  content = '',
  center = true,
  allowUserSelect = false,
}) {
  const style: React.CSSProperties = {
    justifyContent: center ? 'center' : 'initial',
    userSelect: allowUserSelect ? 'text' : 'none',
  };

  return (
    <span style={style} className="label">
      {content}
    </span>
  );
};

export default Label;
