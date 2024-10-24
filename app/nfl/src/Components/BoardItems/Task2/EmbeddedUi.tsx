import React, { useEffect, useState } from "react";
import { createEmbeddingContext } from "amazon-quicksight-embedding-sdk";

const EmbeddedUi = (): React.ReactNode => {
  const [embedTitle, setEmbedTitle] = useState('quicksight')
  useEffect(() => {
    generateEmbedUrl();
  }, [])


        // call backend API to get the embed URL
  const generateEmbedUrl = async () => {
          const backendApiEndpoint = 'REPLACE_WITH_API_ENDPOINT'  // TODO: Replace me!
          const backendResponse = await fetch(backendApiEndpoint)
          const backendResponseJson = await backendResponse.json()
          if(backendResponseJson.url){
            setEmbedTitle('embed_success')
          }
          const embeddingContext = await createEmbeddingContext({
            onChange: (changeEvent, metadata) => {
                console.log('Context received a change', changeEvent, metadata);
            },
        });
    
        const frameOptions = {
            url: backendResponseJson.url, // replace this value with the url generated via embedding API
            container: '#experience-container',
            onChange: (changeEvent, metadata) => {
                switch (changeEvent.eventName) {
                    case 'FRAME_MOUNTED': {
                        console.log("Do something when the experience frame is mounted.");
                        break;
                    }
                    case 'FRAME_LOADED': {
                        console.log("Do something when the experience frame is loaded.");
                        break;
                    }
                }
            },
        };
    
        const contentOptions = {
            hideTopicName: false, 
            theme: '<YOUR_THEME_ID>',
            allowTopicSelection: true,
            onMessage: async (messageEvent, experienceMetadata) => {
                switch (messageEvent.eventName) {
                    case 'Q_SEARCH_OPENED': {
                        console.log("Do something when Q Search content expanded");
                        break;
                    }
                    case 'Q_SEARCH_CLOSED': {
                        console.log("Do something when Q Search content collapsed");
                        break;
                    }
                    case 'Q_SEARCH_SIZE_CHANGED': {
                        console.log("Do something when Q Search size changed");
                        break;
                    }
                    case 'CONTENT_LOADED': {
                        console.log("Do something when the Q Search is loaded.");
                        break;
                    }
                    case 'ERROR_OCCURRED': {
                        console.log("Do something when the Q Search fails loading.");
                        break;
                    }
                }
            }
        };
        const embeddedDashboardExperience = await embeddingContext.embedQSearchBar(frameOptions, contentOptions);
      }


  return (
    <div className='iframe-container' title={embedTitle}>
      <div id="experience-container"></div>
    </div>
  );
};


export default EmbeddedUi;
