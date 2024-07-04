import '../../scss/components/general/Logo.scss';

// Example
// size='30px' doAnimate={false}
export default function Logo({size, doAnimate}) {
    let time= '3s';
    if (!doAnimate) {
        time=  '0s';
    }
    return (
        <div id='logo' style={{width: size}}>
            <div id='first-petal' style={{animationDuration:time}}>
                <div className='petal-left-container'>
                    <div className="petal-left"></div>
                </div>
                <div className='petal-right-container'>
                    <div className="petal-right"></div>
                </div>
            </div>
            <div id='second-petal' style={{animationDuration:time}}>
            <div className='petal-left-container'>
                    <div className="petal-left"></div>
                </div>
                <div className='petal-right-container'>
                    <div className="petal-right"></div>
                </div>
            </div>
            <div id='third-petal' style={{animationDuration:time}}>
            <div className='petal-left-container'>
                    <div className="petal-left"></div>
                </div>
                <div className='petal-right-container'>
                    <div className="petal-right"></div>
                </div>
            </div>
            <div id='forth-petal' style={{animationDuration:time}}>
            <div className='petal-left-container'>
                    <div className="petal-left"></div>
                </div>
                <div className='petal-right-container'>
                    <div className="petal-right"></div>
                </div>
            </div>
            <div id='fifth-petal' style={{animationDuration:time}}>
            <div className='petal-left-container'>
                    <div className="petal-left"></div>
                </div>
                <div className='petal-right-container'>
                    <div className="petal-right"></div>
                </div>
            </div>
        </div>
    )
}
