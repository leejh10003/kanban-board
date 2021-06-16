import axios from "axios";

export default class S3 {
    constructor () {
        this.token = localStorage.getItem('token');
    }

    async upload (file) {
        const form = new FormData();
        form.append('file', file);

        const images = await axios.post('https://trello.jeontuk-11.link/image', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${this.token}`,
                'Access-Control-Allow-Origin': '*'
            }
        });

        return images.data[0].Location;
    }
}