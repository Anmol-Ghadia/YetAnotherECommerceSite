import '../../scss/components/basic/Button.scss';

// A themed button for this website.
// {onclick} is a callback without parameters
// {content} is string
// {fill} is boolean. fills the button if true
export default function Button({ onClick, content, fill }) {

    const fillClass = (fill != null && fill) ? 'theme-button-fill ' : 'theme-button-no-fill ';

    return (
        <div
            class={'theme-button ' + fillClass}
            onClick={onClick}>
            {content}
        </div>
    )
}