import classNames from "classnames/bind";
import style from "./page.module.scss";
const cx = classNames.bind(style);
//
import TaskCard from "@/components/taskCard/TaskCard";
import { getData } from "@/api/api";

interface Card {
  id: number;
  name: string;
  desc: string;
  startTime: string | null;
  endTime: string | null;
  requestedTime: string;
}
export default async function Home() {
  const fetchedData: Card[] = await getData();
  console.log("aaa", fetchedData);

  return (
    <div className={cx("home-wrap")}>
      {fetchedData.map((item, idx) => {
        return item.requestedTime && <TaskCard key={idx} data={item} />;
      })}
    </div>
  );
}
