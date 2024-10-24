export const theme = {
    tokens: {
       // Values are applied globally, except for visual contexts
       colorBackgroundLayoutMain: {
           // Specify value for light and dark mode
           light: 'white',
           dark: 'rgb(15, 27, 42)'
       },
       colorBackgroundContainerContent: {
            light: 'white',
           dark: 'rgb(15, 27, 42)'
       },
       borderRadiusButton: "4px",
       // Shorter syntax to apply the same value for both light and dark mode
       colorTextAccent: '#0073bb',
    },
    contexts: {
       // Values for visual contexts. Unless specified, default values will be applied

       //NFL BLUE COLOR : rgb(1, 51, 105)
       'top-navigation': {
          tokens: {
             colorTextAccent: '#44b9d6',
             colorBackgroundContainerContent: "rgb(15, 27, 42)"
          },
       }
    }
 };