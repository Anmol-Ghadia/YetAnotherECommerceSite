import '../../scss/components/basic/LeftButton.scss';

// A themed button for this website.
// {onclick} is a callback without parameters
// {rotation} is a number in degrees for direction of button,
//            clockwise from left
export default function LeftButton({ onClick, rotation }) {

    const buttonRotation = rotation == null ? 0 : rotation;

    return (
        <div style={{ rotate: `${buttonRotation}deg` }}
            class='theme-left-button'
            onClick={onClick}>
            <div className="theme-left-button-image"></div>
        </div>
    )
}