import React from 'react';

const MemeDraw = props => {
    let { url, name } = props.data;
    let {clickEvent} = props;
    return (
        <div onClick={clickEvent}>
            <img src={url} alt={name} style={{ width: 200, height: 200 }} />
            <div>{name}</div>
        </div >
    )
}
class MemeTemplate extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isError: false,
            memeData: []
        }
    }
    memeClicked(data) {
        console.log(data);
    }
    componentDidMount() {
        let memeRequest = new Request(`https://api.imgflip.com/get_memes`, {
            method: 'GET'
        });
        this.setState({
            isLoading: true
        });
        fetch(memeRequest)
            .then(res => res.json())
            .then(response => {
                if (response.success === true) {
                    this.setState({
                        memeData: response.data.memes,
                        isLoading: false,
                        isError: false
                    });
                }
            })
            .catch(error => {
                this.setState({
                    isError: true,
                    isLoading: false
                })
            })
    }
    render() {
        let { memeData, isLoading, isError } = this.state;
        return (
            <div className="flex-container">
                {memeData && memeData.length > 0 ? memeData.map((data, index) => (
                    <MemeDraw key={data.id} data={data} clickEvent={this.memeClicked.bind(this, data)} />
                )) : null}
                {isLoading && <div>Loading...</div>}
                {isError && <div>something went wrong!! Please try again</div>}
            </div>
        )
    }
}
export default MemeTemplate;