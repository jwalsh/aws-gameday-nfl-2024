import React, { useEffect } from 'react';
import usePersistState from '../Utils/UsePersiState';
import {
    HelpPanel,
    Link,
    Toggle,
    SpaceBetween
  } from '@cloudscape-design/components';

  import { applyMode, Mode } from '@cloudscape-design/global-styles';




function Tools(): React.ReactNode {
    const [darkmode, setDarkmode] = usePersistState(false, "darkmode");

    useEffect(() => {
        if(darkmode) {
            applyMode(Mode.Dark);
        } else {
            applyMode(Mode.Light);
        }
        
    }, [darkmode]);

    return (
        <HelpPanel
            header={<h2>Help Panel</h2>}>
            <SpaceBetween size='l'>
                <Link external href='https://docs.aws.amazon.com/'> AWS Documentation</Link>
                {/*
                <Toggle
                    onChange={({ detail }) => setDarkmode(detail.checked)}
                    checked={darkmode}
                >
                    Darkmode
                </Toggle>*/}
            </SpaceBetween>
        </HelpPanel>
    );
}

export default Tools;