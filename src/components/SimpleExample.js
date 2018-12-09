import React from 'react';

export default class Images extends React.Component {
    /*for simple e-handling, this-binding example*/
    constructor() {
        super();
        this.state = {
            images: [
                {
                    id: 'image_0',
                    src: 'http://www.imagesgoodnight.com/wp-content/uploads/2018/06/alone-images10-300x300.gif'
                },
                {
                    id: 'image_1',
                    src: 'https://goodmorningimageshddownload.com/wp-content/uploads/2018/07/floasaswer-good-morning-ima-300x300.jpg' 
                },
                {
                    id: 'image_2',
                    src: 'https://freehindistatus.com/wp-content/uploads/2018/05/whatsapp-dp-images-funny-300x300.jpg' 
                }   
            ],
            selectedImage: {
                id: 'image_0',
                src: 'http://www.imagesgoodnight.com/wp-content/uploads/2018/06/alone-images10-300x300.gif'
            }
        };
        this.selectImage = this.selectImage.bind(this);
    }
    
    selectImage(e) {
        let id = e.target.id;
        this.setState({selectedImage: this.state.images.find((im) => im.id === id)});
    }
    // otherSelect(id) {
    //     this.setState({selectedImage: this.state.images.find((im) => im.id === id)});
    // }

    render() {

        const thumbnails = this.state.images.map((im) => {
            return (
                <div 
                    key={im.id} 
                    onClick={this.selectImage}
                    style={{cursor: 'pointer'}}
                >
                    <img id={im.id} src={im.src} alt="some alt" width="150px" />
                </div>
            );
        });
        let selectedImage = this.state.selectedImage;
        return (
            <div style={{display: 'flex'}}>
                <div>
                    <p>Thumbnails:</p>
                    {thumbnails}
                </div>
                <div>
                    <p>Selected: </p>
                    <img src={selectedImage.src} alt='selected' />
                </div>
            </div>
        );
    }

}