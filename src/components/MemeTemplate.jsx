import React from 'react';
import { FaFacebookSquare, FaWhatsappSquare, FaTwitterSquare, FaInstagram } from 'react-icons/fa';
const MemeDraw = props => {
    let { url, name } = props.data;
    let { clickEvent } = props;
    return (
        <div onClick={clickEvent}>
            <img src={url} alt={name} style={{ width: 200, height: 200 }} />
            <div>{name}</div>
        </div>
    )
}
const MemeModal = props => {
    let { text0, text1, sharableMeme } = props.data;
    let { name, url } = props.data.cmData;
    let { clickEvent, createMemeEvent, changeHandler, shareMeme } = props;

    return (
        <div id="openModal" className="modalDialog">
            <div>
                <span onClick={clickEvent} title="Close" className="close">X</span>
                <h2>{name}</h2>
                <form className="createform">
                    <label>
                        Text0:</label>
                    <textarea value={text0} onChange={changeHandler} type="text" name="text0" id="text0"></textarea>

                    <br />
                    <label>
                        Text1: </label>
                    <textarea value={text1} onChange={changeHandler} type="text" name="text1" id="text1"></textarea>

                    {sharableMeme.length <= 0 ?
                        <div className="memeImg"><img alt={name} src={url} style={{ width: 200, height: 200 }} /></div>
                        :
                        <div className="memeImg"><input id="memeImg" type="image" alt={name} src={sharableMeme} style={{ width: 200, height: 200 }} /></div>}

                    <div>
                        <input type="button" className="creatememe" onClick={createMemeEvent} value="Create Meme" />
                    </div>

                </form>
                {sharableMeme.length > 0 ?
                    <React.Fragment>
                        <div>Share this meme to social media:</div>
                        <button onClick={shareMeme} name="fb" className="shareButton"><FaFacebookSquare /></button>
                        <button onClick={shareMeme} name="wa" className="shareButton"><FaWhatsappSquare /></button>
                        <button onClick={shareMeme} name="tw" className="shareButton"><FaTwitterSquare /></button>
                    </React.Fragment> : null}

            </div>
        </div>
    )
}

class MemeTemplate extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isError: false,
            memeData: [],
            memeOpenModal: false,
            currentMemeData: {
                text0: '',
                text1: '',
                cmData: {},
                sharableMeme: ''
            }
        }
    }
    memeClicked(data, event) {
        event.preventDefault();
        let currentMemeData = { ...this.state.currentMemeData };
        currentMemeData.cmData = data;
        this.setState({
            memeOpenModal: true,
            currentMemeData: currentMemeData
        })

    }
    createMeme(data, event) {
        event.preventDefault();

        this.createMemePost(data);
    }
    createMemePost = (data) => {
        let url = "https://api.imgflip.com/caption_image";
        let user = "dixant",
            password = "water!sg00d";
        let memeRequest = new Request(`${url}?template_id=${data.cmData.id}&username=${user}&password=${password}&text0=${data.text0}&text1=${data.text1}`, {
            method: 'POST'
        })
        fetch(memeRequest)
            .then(res => res.json())
            .then(response => {
                if (response.success === true) {
                    let currentMemeData = { ...this.state.currentMemeData };
                    currentMemeData.sharableMeme = response.data.url;
                    this.setState({
                        currentMemeData: currentMemeData
                    })
                }
            })
    }
    shareMeme(event) {
        event.stopPropagation();
        switch (event.currentTarget.name) {
            case "fb":
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.state.currentMemeData.sharableMeme}`, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                break;
            case "wa":
                let url = encodeURIComponent(`${this.state.currentMemeData.sharableMeme}`);
                console.log(url)
                fetch(this.state.currentMemeData.sharableMeme)
                    .then(function (response) {
                        return response.blob()
                    })
                    .then(function (blob) {
                        // here the image is a blob
                        console.log(blob);
                        if (navigator.share) {
                            navigator.share({
                                title: "Meme",
                                text: this.state.currentMemeData.cmData.name,
                                url: url,
                                file: blob
                            }).then(() => console.log('Successful share'))
                                .catch(error => console.log('Error sharing:', error));
                        }
                        else {
                            console.log("Web Share API is not supported in your browser.")
                        }
                    });

                /*window.open(`whatsapp://send?src=${encodeURIComponent(this.state.currentMemeData.sharableMeme)}`, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');*/
                break;
            case "tw":
                window.open(`https://twitter.com/share?url=${this.state.currentMemeData.sharableMeme}`, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                break;
            default:
                break;
        }

        //return false;
    }
    closeModal(event) {
        let currentMemeData = { ...this.state.currentMemeData };
        currentMemeData.text0 = '';
        currentMemeData.text1 = '';
        currentMemeData.cmData = {};
        currentMemeData.sharableMeme = '';
        this.setState({
            memeOpenModal: false,
            currentMemeData: currentMemeData
        })
    }
    changeHandler(event) {
        let currentMemeData = { ...this.state.currentMemeData };
        currentMemeData[event.target.name] = event.target.value;
        this.setState({
            currentMemeData: currentMemeData
        })
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
        let { memeData, isLoading, isError, memeOpenModal, currentMemeData } = this.state;
        return (
            <React.Fragment>
                <div>start with a basic meme template:</div>
                <div className="flex-container">

                    {memeData && memeData.length > 0 ? memeData.map((data, index) => (
                        <MemeDraw key={data.id} data={data} clickEvent={this.memeClicked.bind(this, data)} />
                    )) : null}
                    {isLoading && <div>Loading...</div>}
                    {isError && <div>something went wrong!! Please try again</div>}
                </div>
                {memeOpenModal && <MemeModal data={currentMemeData} shareMeme={this.shareMeme.bind(this)} changeHandler={this.changeHandler.bind(this)} clickEvent={this.closeModal.bind(this)} createMemeEvent={this.createMeme.bind(this, currentMemeData)} />}
            </React.Fragment>
        )
    }
}
export default MemeTemplate;