import { Composition } from 'remotion';
import { WalkthroughComposition } from './Composition';
import './style.css';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="AOEv2_Walkthrough"
                component={WalkthroughComposition}
                durationInFrames={450}
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};
