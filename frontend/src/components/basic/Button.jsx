import '../../scss/components/basic/Button.scss';

// A themed button for this website.
// {onclick} is a callback without parameters
// {content} is string
export default function Button({ onClick, content }) {
    return (
        <div
            class='theme-button'
            onClick={onClick}>
            {content}
        </div>
    )
}