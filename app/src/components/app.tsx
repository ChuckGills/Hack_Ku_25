import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import {Terminal} from './Terminal.tsx';

const App: React.FC = () => {
    return (
        <>
            <Terminal/>
        </>
    )
};

const root = createRoot(document.body);
root.render(<App />);