import { useState, useRef, useEffect } from "react";
import useDebouncedFunction from "../hooks/useDeboncedFunction";
import cn from "classnames";

export const ScrollableContainer = ({
    loadImageStyle,
    encodeImageFileAsURL,
}) => {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [selectedImage, setSelectedImage] = useState(false);
    const [loadedImage, setLoadedImage] = useState("../../images/load.jpg");

    const listRef = useRef(null);

    const listOfStyles = [
        { id: 1, name: "Scream", src: "..\\..\\images\\scream.jpg" },
        // { id: 2, name: "Anime", src: "..\\..\\images\\anime.jpg" },
        { id: 3, name: "Comics", src: "..\\..\\images\\comics.jpg" },
        { id: 4, name: "Cubism", src: "..\\..\\images\\cubism.jpg" },
        { id: 5, name: "Disco", src: "..\\..\\images\\disco.jpg" },
        // { id: 6, name: "Graffiti", src: "..\\..\\images\\graffiti.jpg" },
        {
            id: 7,
            name: "Impressionism",
            src: "..\\..\\images\\impressionism.jpg",
        },
        { id: 8, name: "Mosaic", src: "..\\..\\images\\mosaic.jpg" },
        { id: 9, name: "Sepia", src: "..\\..\\images\\sepia.jpg" },
        // { id: 10, name: "Sketch", src: "..\\..\\images\\sketch.jpg" },
        { id: 11, name: "Surrealism", src: "..\\..\\images\\surrealism.jpg" },
        { id: 12, name: "Van Gogh", src: "..\\..\\images\\van_gogh.jpeg" },
        { id: 13, name: "Waves", src: "..\\..\\images\\waves.jpg" },
    ];

    const checkForScrollPosition = () => {
        const { current } = listRef;
        if (current) {
            const { scrollLeft, scrollWidth, clientWidth } = current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft !== scrollWidth - clientWidth);
        }
    };

    const debounceCheckForScrollPosition = useDebouncedFunction(
        checkForScrollPosition,
        200
    );

    const scrollContainerBy = (distance) =>
        listRef.current?.scrollBy({ left: distance, behavior: "smooth" });

    const loadStyleFromDevice = (element) => {
        console.log(element);
        var file = element.target.files[0];
        var reader = new FileReader();
        reader.onload = function () {
            setLoadedImage(reader.result);
        };
        reader.readAsDataURL(file);
        encodeImageFileAsURL(2, element);
    };

    useEffect(() => {
        const { current } = listRef;
        checkForScrollPosition();
        current?.addEventListener("scroll", debounceCheckForScrollPosition);

        return () => {
            current?.removeEventListener(
                "scroll",
                debounceCheckForScrollPosition
            );
        };
    }, []);

    return (
        <div className="scrollableContainer">
            <ul className="scrollableContainer_list" ref={listRef}>
                <li
                    className={cn("scrollableContainer_item", {
                        "scrollableContainer_item--selected":
                            14 === selectedImage,
                    })}
                    onClick={() => {
                        setSelectedImage(14);
                    }}
                >
                    <span>
                        <img
                            className="scrollableContainer_item_image"
                            src={loadedImage}
                        />
                        <label className="scrollableContainer_item_upload-style">
                            <input
                                type="file"
                                name="fileToUpload"
                                id="fileToUpload"
                                size="1"
                                style={{ display: "none" }}
                                onChange={loadStyleFromDevice.bind(this)}
                            />
                        </label>
                        <span className="scrollableContainer_item_name">
                            Upload
                        </span>
                    </span>
                </li>
                {listOfStyles.map((style, index) => (
                    <li
                        className={cn("scrollableContainer_item", {
                            "scrollableContainer_item--selected":
                                index === selectedImage,
                        })}
                        onClick={() => {
                            loadImageStyle(style.src);
                            setSelectedImage(index);
                        }}
                    >
                        <span>
                            <img
                                className="scrollableContainer_item_image"
                                src={style.src}
                            />
                            <span className="scrollableContainer_item_name">
                                {style.name}
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
            <button
                type="scrollableContainer_button"
                disabled={!canScrollLeft}
                onClick={() => scrollContainerBy(-400)}
                className={cn(
                    "scrollableContainer_button",
                    "scrollableContainer_buttonLeft",
                    {
                        "scrollableContainer_button--hidden": !canScrollLeft,
                    }
                )}
            >
                ←
            </button>
            <button
                type="scrollableContainer_button"
                disabled={!canScrollRight}
                onClick={() => scrollContainerBy(400)}
                className={cn(
                    "scrollableContainer_button",
                    "scrollableContainer_buttonRight",
                    {
                        "scrollableContainer_button--hidden": !canScrollRight,
                    }
                )}
            >
                →
            </button>
            {canScrollLeft ? (
                <div className="scrollableContainer_shadowWrapper scrollableContainer_leftShadowWrapper">
                    <div className="scrollableContainer_shadow scrollableContainer_leftShadow" />
                </div>
            ) : null}
            {canScrollRight ? (
                <div className="scrollableContainer_shadowWrapper scrollableContainer_rightShadowWrapper">
                    <div className="scrollableContainer_shadow scrollableContainer_rightShadow" />
                </div>
            ) : null}
        </div>
    );
};
