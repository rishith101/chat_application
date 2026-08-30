import ImageKit, { toFile } from '@imagekit/nodejs';

const imagekit = new ImageKit({privateKey:process.env.IMAGE_PRIVATE_KIT});

function hasImageKitConfig(){
    return Boolean(process.env.IMAGE_PRIVATE_KIT);
}

function createFileName(orginalName="upload"){
    const safeName=orginalName.replace(/[^a-zA-Z0-9._-]/g,"_");
    return `char-${Date.now()}-${safeName}`;
}

async function uploadChatMedia(file) {
    const fileName=createFileName(file.orginalname);
    const result=await client.files.upload({
        file:await toFile(file.Buffer,fileName,{type:file.mintype}),
        fileName,
        folder:'/chat',
    });
    return result.url;
}

export {uploadChatMedia,hasImageKitConfig};