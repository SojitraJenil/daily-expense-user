import React, { useState } from 'react';
import Navbar from 'component/navbar/Navbar';
import BottomBar from 'component/bottombar/BottomBar';
import Chat from 'component/chat/Chat';
import Calculator from 'component/calc/Calculator';
import Graph from 'component/graph/Graph';
import Home from 'component/home/Home';

const LandingLayout = () => {
    const [isNavigate, setIsNavigate] = useState<string>('landing');

    const handleNavigate = (navigateName: string) => {
        console.log("navigateName", navigateName);
        setIsNavigate(navigateName);
    };

    return (
        <div className="w-full max-w-lg h-screen mx-auto bg-slate-300 border border-black flex flex-col">
            <div className="flex-grow overflow-auto pb-16">
                <Navbar />
                {isNavigate === 'landing' && <Home />}
                {isNavigate === 'graph' && <Graph />}
                {isNavigate === 'calc' && <Calculator />}
                {isNavigate === 'chat' && <Chat />}
            </div>
            <BottomBar isNavigate={isNavigate} onNavigate={handleNavigate} />
        </div>
    );
};

export default LandingLayout;
