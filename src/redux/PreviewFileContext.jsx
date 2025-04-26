import React, { createContext, useContext, useState } from 'react';

const PreviewFileContext = createContext();

export const PreviewFileProvider = ({ children }) => {
    const [previewFile, setPreviewFile] = useState(null);
    return (
        <PreviewFileContext.Provider value={{ previewFile, setPreviewFile }}>
            {children}
        </PreviewFileContext.Provider>
    );
};

export const usePreviewFile = () => useContext(PreviewFileContext);