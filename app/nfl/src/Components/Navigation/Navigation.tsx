import TopNavigation from "@cloudscape-design/components/top-navigation";

const Navigation = (): React.ReactNode => {
  return (
    <TopNavigation
      identity={{
        href: "/",
        title: "National Football League",
        logo: {
          src: "/nfl-logo.png",
          alt: "Service",
        },
      }}
    />
  );
};

export default Navigation;
