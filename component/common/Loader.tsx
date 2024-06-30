import React from 'react';

interface LoaderProps {
    height?: number;
    width?: number;
    color?: string;
}

const CustomLoader: React.FC<LoaderProps> = ({ height = 20, width = 20, color = 'white' }) => {
    const loaderStyle = {
        height: `${height}px`,
        width: `${width}px`,
        borderTop: `3px solid ${color}`,
        borderRight: `3px solid ${color}`,
        borderBottom: `3px solid ${color}`,
        borderLeft: '3px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    };

    return (
        <div style={loaderStyle} className='mx-auto'></div>
    );
};

export const Loader: React.FC<LoaderProps> = () => {
    return (
        <>
            <div className={`h-[calc(100vh-12rem)] w-full flex justify-center items-center flex-col `}>
                <span className="customLoader"></span>
            </div>
        </>
    );
};

export default CustomLoader