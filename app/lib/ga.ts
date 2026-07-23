import ReactGA from "react-ga4";
export const initGA = () => {
  ReactGA.initialize("G-6PH0DEWBPF");
};

export const logEvent = (
  action: string,
  category: string = "Button",
  label?: string
) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
