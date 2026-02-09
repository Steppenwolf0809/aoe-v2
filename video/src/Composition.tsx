import { Sequence, Img, staticFile, useCurrentFrame, interpolate } from 'remotion';
import React from 'react';

const Screen = ({ src, title, description }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 30], [0, 1]);
    const scale = interpolate(frame, [0, 30], [0.8, 1]);

    return (
        <div style={{
            flex: 1,
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity,
            transform: `scale(${scale})`
        }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <h1 style={{
                    fontSize: 80,
                    fontFamily: 'sans-serif',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: 0
                }}>{title}</h1>
                <p style={{
                    fontSize: 40,
                    fontFamily: 'sans-serif',
                    color: '#64748b',
                    marginTop: 20
                }}>{description}</p>
            </div>
            <Img
                src={staticFile(src)}
                style={{
                    width: '70%',
                    borderRadius: 24,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
            />
        </div>
    );
};

export const WalkthroughComposition = () => {
    return (
        <div style={{ flex: 1, backgroundColor: 'white' }}>
            <Sequence from={0} durationInFrames={225}>
                <Screen
                    src="assets/screens/home.png"
                    title="AOE v2 Landing Page"
                    description="Legal Certainty at Speed"
                />
            </Sequence>
            <Sequence from={225} durationInFrames={225}>
                <Screen
                    src="assets/screens/services.png"
                    title="Services Catalog"
                    description="All Your Legal Tools in One Place"
                />
            </Sequence>
        </div>
    );
};
