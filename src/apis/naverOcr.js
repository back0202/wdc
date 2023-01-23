

import axios from "axios"


export const getText = (file) => {
    let participants
    let reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = async () => {
        const timestamp = new Date().getTime()
        const userList = await axios.post("https://c9eyrk14dx.apigw.ntruss.com/custom/v1/19360/14d25136a59e5e017992c4ea248e8b2b26e0fc1cac2a3e2eeb29abd1a45cef33/general", {
            images: [
                {
                    format: "png",
                    name: "userList",
                    data: reader.result.split(",")[1]
                },
            ],
            requestId: "string",
            timestamp: timestamp,
            virsion: "V2"
        },
            {
                headers: {
                    "X-OCR-SECRET": "Y1NLVk5adUxFSElWdmFheklNdllNc2tUQ2FHREtQcEE=",
                }
            }
        )
        console.log(userList)
    }
}

