import Image from "next/image";

const images = [
    "https://cdn.pixabay.com/photo/2021/11/10/07/34/rubbish-6783223_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/05/30/09/58/pollution-3441119_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/09/28/21/56/leaf-2797173_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/09/01/22/05/recycle-2705681_1280.jpg",
    "https://cdn.pixabay.com/photo/2013/09/17/21/33/cars-cemetry-183249_960_720.jpg",
    "https://cdn.pixabay.com/photo/2023/11/17/14/48/ai-generated-8394496_1280.jpg",
];

const ImageLogin = () => {

    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];

    return (
        <div className="hidden lg:inline-flex w-[60%]">
            <Image
                src={selectedImage}
                alt="Sample"
                width={960}
                height={720}
                className="w-full"
                priority
            />
        </div>
    )
}

export default ImageLogin