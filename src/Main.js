/** @jsx jsx */
import { jsx } from "theme-ui";
import Header from "./components/Header";
import Card from "./components/Card";
import IotButton from "./components/IotButton";
import LineChart from "./components/LineChart";
import Preferences from "./components/Preferences";

const Main = () => {
  return (
    <div>
      <Header />
      <div className="container">
        <Card title="Statistics" body={<LineChart />} />
        <Card title="Preferences" body={<Preferences />} />
        <Card body={<IotButton />} />
      </div>
    </div>
  );
};

export default Main;
