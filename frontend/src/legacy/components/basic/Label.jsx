import '../../scss/components/basic/Label.scss';

// Represents a text displaued to user
// {content} the content of the label, could also be jsx
// {center} boolean for centering the label in available space
//          - false [default]
// {allowUserSelect} boolean to allow users to select the content
//          - false [default]
export default function Label({content, center, allowUserSelect}) {
    const style = {
        justifyContent: center ? 'center' : 'initial',
        userSelect: allowUserSelect ? 'text' : 'none'
    };
    
    return (
    <span 
        style={style}
        className='label'>
        {content}
    </span>)
}