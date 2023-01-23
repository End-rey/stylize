export const LoadingProgressBar = ({percents}) => {
    return (
        <div className="progress-bar">
            <div className="proggres-bar_line" style={{width:percents+"%"}}>
            </div>
        </div>
    );
}