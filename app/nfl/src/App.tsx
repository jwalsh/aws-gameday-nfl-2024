import "@aws-amplify/ui-react/styles.css";
import { useState } from "react";
import "./App.css";

import {
  AppLayout,
  Box,
  Container,
  ContentLayout,
  Grid,
} from "@cloudscape-design/components";

import { I18nProvider } from "@cloudscape-design/components/i18n";
import messages from "@cloudscape-design/components/i18n/messages/all.en";

import MainContent from "./Components/MainContent/MainContent";
import Navigation from "./Components/Navigation/Navigation";
import Tools from "./Components/Tools/Tools";

import "@cloudscape-design/global-styles/index.css";

import { Route, Routes } from "react-router-dom";
import PlayerDetail from "./Components/BoardItems/Task1/PlayerDetail";
import Players from "./Components/BoardItems/Task1/Players";
import EmbeddedUi from "./Components/BoardItems/Task2/EmbeddedUi";

const LOCALE = "en";

const Layout = ({ content }: any) => (
  <ContentLayout
    defaultPadding
    headerVariant="high-contrast"
    headerBackgroundStyle={`center center/cover url("/nfl-header.jpg")`}
    header={
      <Box padding={{ vertical: "xxxl" }}>
        <Grid gridDefinition={[{ colspan: { default: 12, s: 8 } }]}>
          <Container>
            <Box padding="s">
              <Box
                fontSize="display-l"
                fontWeight="bold"
                variant="h1"
                padding="n"
              >
                AWS Gameday
              </Box>
              <Box fontSize="display-l" fontWeight="light">
                NFL Dashboard
              </Box>
            </Box>
          </Container>
        </Grid>
      </Box>
    }
  >
    <Container fitHeight={true}>{content}</Container>
  </ContentLayout>
);

function Content() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/player" element={<Players />} />
        <Route path="/player/detail" element={<PlayerDetail />} />
        <Route path="/data_analytics" element={<EmbeddedUi />} />
      </Routes>
    </>
  );
}

function App() {
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <Navigation />
      <AppLayout
        disableContentPaddings={true}
        navigationHide={true}
        notifications={<></>}
        toolsOpen={toolsOpen}
        onToolsChange={() => {
          setToolsOpen(!toolsOpen);
        }}
        tools={Tools()}
        content={<Layout content={<Content />} />}
        splitPanel={<></>}
      />
    </I18nProvider>
  );
}

export default App;
