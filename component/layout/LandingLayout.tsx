import React, { useState, Suspense, lazy } from 'react';
import Navbar from 'component/navbar/Navbar';
import BottomBar from 'component/bottombar/BottomBar';
import Home from 'component/home/Home';

const Graph = lazy(() => import('component/graph/Graph'));
const Chat = lazy(() => import('component/chat/Chat'));
const Calculator = lazy(() => import('component/calc/Calculator'));

const LandingLayout = () => {
    const [isNavigate, setIsNavigate] = useState<string>('landing');

    const handleNavigate = (navigateName: string) => {
        setIsNavigate(navigateName);
    };

    return (
        <div className="w-full max-w-lg h-screen mx-auto bg-slate-300 border border-black flex flex-col">
            <div className="flex-grow overflow-auto">
                <Navbar />
                {isNavigate === 'landing' && <Home />}
                <Suspense fallback={<div>Loading...</div>}>
                    {isNavigate === 'graph' && <Graph />}
                    {isNavigate === 'calc' && <Calculator />}
                    {isNavigate === 'chat' && <Chat />}
                </Suspense>
            </div>
            <BottomBar isNavigate={isNavigate} onNavigate={handleNavigate} />
        </div>
    );
};

export default LandingLayout;
