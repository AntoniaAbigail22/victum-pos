import React, { createContext, useContext, useState } from 'react';

const ImageCacheContext = createContext({});

export const ImageCacheProvider = ({ children }) => {
    const [imageCache, setImageCache] = useState({});

    const updateImageCache = (id, url) => {
        setImageCache((prevCache) => ({ ...prevCache, [id]: url }));
    };

    return (
        <ImageCacheContext.Provider value={{ imageCache, updateImageCache }}>
            {children}
        </ImageCacheContext.Provider>
    );
};

export const useImageCache = () => useContext(ImageCacheContext);