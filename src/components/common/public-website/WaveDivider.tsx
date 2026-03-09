import React from 'react';

export default function WaveDivider() {
    return (
        <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 100" fill="none" className="w-full" preserveAspectRatio="none">
                <path
                    d="M0 100L60 90C120 80 240 60 360 50C480 40 600 40 720 45C840 50 960 60 1080 65C1200 70 1320 70 1380 70L1440 70V100H0Z"
                    fill="white"
                />
            </svg>
        </div>
    );
}
