

import axios from "axios"


export const getText = (file) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = async () => {

        const timestamp = new Date().getTime()
        const userList = axios.post("http://localhost:8080/api/ocr", { data: reader.result })


    }

}