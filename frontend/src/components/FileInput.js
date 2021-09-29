import Axios from 'axios'
import {useState} from 'react'

const FileInput = () => {
    const [file, setFile] = useState('')
    const [filename, setFilename] = useState('')
    const [uploadedFile, setUploadedFile] = useState({})
    const onChange = e => {
        setFile(e.target.files[0])
        setFilename(e.target.files[0].name)
    }

    const onSubmit = e => {
        e.preventDefault();
        let file = {filename, filepath}
        const formData = new FormData();
        formData.append('file', file)
        Axios.post('localhost:3001/api/uploadImage', formData, 
        {
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })
        .then((result) => {
            file = result.data
        })
    }

    return (
        <form onSubmit = {onSubmit}>

        </form>
    )
}