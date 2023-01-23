import { useState } from "react";
import { ScrollableContainer } from "../components/ScrollableContainer";
import { saveAs } from "file-saver";
import { LoadingProgressBar } from "../components/LoadingProgressBar";
import Resizer from "react-image-file-resizer";

export default function MainPage() {
    const [img1, setImg1] = useState(null);
    const [img2, setImg2] = useState(null);
    const [ws, setWs] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const headerButtons = ["Load Image", "Save"];

    const handleClick = () => {
        var i = 0;

        if (img1 === null || img2 === null) {
            return 0;
        }
        if (ws !== null) {
            console.log(ws);
            console.log("ws есть уже, давай захлопывай");
            ws.close();
        }
        const socket = new WebSocket("ws://localhost:8000/ws");
        setWs(socket);

        var tmp = {
            image1: img1,
            image2: img2,
        };
        console.log(tmp);

        socket.onopen = (event) => {
            console.log("[open] Соединение установлено");
            socket.send(JSON.stringify(tmp));
            console.log("images sends");
            setIsLoading(true);
            setProgress(0);
        };

        socket.onmessage = (event) => {
            console.log(`[message] Данные получены с сервера`);
            setResultImage("data:image/jpg;base64," + event.data);
            i = i + 0.5;
            setProgress(i);
            if (i == 100) {
                setIsLoading(false);
            }
        };

        socket.onclose = function (event) {
            setIsLoading(false);
            if (event.wasClean) {
                console.log(
                    `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
                );
            } else {
                console.log("[close] Соединение прервано: ", event);
            }
        };

        socket.onerror = function (error) {
            console.log(`[error]`);
        };
    };

    function encodeImageFileAsURL(img, element) {
        console.log(img, element);
        var file = element.target.files[0];
        try {
            Resizer.imageFileResizer(
              file,
              3000,
              4000,
              "JPEG",
              75,
              0,
              (uri) => {
                console.log(uri);
                if (img == 1) {
                    console.log("img1");
                    setResultImage(uri);
                    setImg1(uri);
                } else if (img == 2) {
                    console.log("img2");
                    setImg2(uri);
                }
              },
              "base64",
              1000,
              1000
            );
          } catch (err) {
            console.log(err);
          }
    }

    const toDataURL = (url) =>
        fetch(url)
            .then((response) => response.blob())
            .then(
                (blob) =>
                    new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    })
            );

    const loadImageStyle = (src) => {
        toDataURL(src).then((dataUrl) => {
            setImg2(dataUrl);
        });
    };

    return (
        <div>
            <header>
                <ul className="nav">
                    <li className="nav-item1">
                        <div className="nav-buttons">
                            <label className="nav-item1_upload-style">
                                <input
                                    type="file"
                                    name="fileToUpload"
                                    className="nav-item1_input-file"
                                    size="1"
                                    style={{ display: "none" }}
                                    onChange={encodeImageFileAsURL.bind(
                                        this,
                                        1
                                    )}
                                />
                            </label>
                            {headerButtons[0]}
                        </div>
                    </li>
                    <li className="nav-item2">
                        <div
                            className="nav-buttons"
                            onClick={() => saveAs(resultImage, "result.jpg")}
                        >
                            {headerButtons[1]}
                        </div>
                    </li>
                </ul>
            </header>
            <div className="result-button">
                <button className="btnSocket" onClick={handleClick}>
                    <span>Stylize!</span>
                </button>
            </div>
            <div className="main-content">
                <div className="block-result-image">
                    {resultImage && (
                        <img
                            className="result-image"
                            src={resultImage}
                            alt="WebSocket Image"
                        />
                    )}
                </div>
                {isLoading && (
                    <div className="block-loading">
                        <LoadingProgressBar percents={progress} />
                    </div>
                )}
            </div>
            <footer className="footer">
                <ScrollableContainer
                    loadImageStyle={loadImageStyle}
                    encodeImageFileAsURL={encodeImageFileAsURL}
                />
            </footer>
        </div>
    );
}
