import { useSearchParams } from "react-router-dom";
import { useGetPlayerInfo } from "./hooks";
import KeyValuePairs from "@cloudscape-design/components/key-value-pairs";
import { LoadingBar } from "@cloudscape-design/chat-components";
import { Box } from "@cloudscape-design/components";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import Calendar from "@cloudscape-design/components/calendar";
import Toggle from "@cloudscape-design/components/toggle";
import usePersistState from "../../Utils/UsePersiState";
import convert from "convert";
import { getTheFlag, getPosition } from "./utils";

import Grid from "@cloudscape-design/components/grid";

import "@cloudscape-design/global-styles/dark-mode-utils.css";

const PlayerDetail = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("player_id");
  const [toggleMetric, setToggleMetric] = usePersistState(
    false,
    "toggleMetric"
  );

  const { data, isLoading } = useGetPlayerInfo(id as string);
  console.log(data);

  if (isLoading) {
    return (
      <div aria-live="polite">
        <Box margin={{ bottom: "xs", left: "l" }} color="text-body-secondary">
          Generating a response
        </Box>
        <LoadingBar variant="gen-ai" />
      </div>
    );
  }

  if (data) {
    let birthday = new Date(data.birth_date);
    let timeDiff = Math.abs(Date.now() - birthday.getTime());
    let age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    let position = getPosition(data.position);
    let src =
      "/position-svg/" + position.toLowerCase().replace(" ", "") + ".svg";

    const calendarCenter = {};
    return (
      <>
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/" },
            {
              text: data.name + " - " + data.pk,
              href: "",
            },
          ]}
          ariaLabel="Breadcrumbs"
        />
        <Box float="right">
          <Toggle
            onChange={({ detail }) => setToggleMetric(detail.checked)}
            checked={toggleMetric}
          >
            {toggleMetric ? "Metric" : "Imperial"}
          </Toggle>
        </Box>
        <Box margin={{ top: "l" }}>
          <KeyValuePairs
            columns={4}
            items={[
              {
                label: "Player",
                value: data.name ? (
                  <Box textAlign="center">
                    <Box margin={"xl"}>
                      <img src={src} height={200} />
                    </Box>
                    <Box>
                      {data.name} - <strong> {position} </strong>
                    </Box>
                  </Box>
                ) : (
                  "N/A"
                ),
              },
              {
                label: "Date of Birth",
                value: data.birth_date ? (
                  <Box textAlign="center">
                    <Box>{age} years old!</Box>
                    <Box textAlign="center">
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Calendar value={data.birth_date} />
                      </div>
                    </Box>
                  </Box>
                ) : (
                  "N/A"
                ),
              },
              {
                label: "College",
                value: data.college ? (
                  <Box textAlign="center">
                    <Box margin={"xl"}>
                      <img
                        src={getTheFlag(data.college)}
                        height={200}
                        style={{ border: "solid 1px black" }}
                      />
                    </Box>
                    <Box>{data.college}</Box>
                  </Box>
                ) : (
                  "N/A"
                ),
              },
              {
                label: "Height - Weight",
                value: data.height ? (
                  <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                    <Box textAlign="center">
                      <Box>
                        <img
                          src="/human_whitemode.svg"
                          className="awsui-util-hide-in-dark-mode"
                          width={200}
                          height={200}
                        />
                      </Box>
                      <Box>
                        {toggleMetric
                          ? parseFloat(
                              convert(
                                parseFloat(data.height.replace("-", ".")),
                                "feet"
                              )
                                .to("best", "metric")
                                .toString()
                            )
                              .toFixed(2)
                              .toString() + " m"
                          : data.height.replace("-", ".") + " ft"}
                      </Box>
                    </Box>
                    <Box textAlign="center">
                      <Box>
                        <img
                          src="/scale_black.svg"
                          className="awsui-util-hide-in-dark-mode"
                          width={100}
                          height={200}
                        />
                      </Box>
                      <Box>
                        {toggleMetric
                          ? parseFloat(
                              convert(parseFloat(data.weight), "lb")
                                .to("best", "metric")
                                .toString()
                            )
                              .toFixed(2)
                              .toString() + " kg"
                          : data.weight + " lb"}
                      </Box>
                    </Box>
                  </Grid>
                ) : (
                  "N/A"
                ),
              },
            ]}
          />
        </Box>
        <Box display="none">
          <div>{data.birth_date}</div>
          <div>{data.college}</div>
          <div>{data.height}</div>
          <div>{data.weight}</div>
          <div>{data.name}</div>
          <div>{data.pk}</div>
          <div>{data.position}</div>
        </Box>
      </>
    );
  }
};

export default PlayerDetail;
