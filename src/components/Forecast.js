import React from "react";
import { iconUrlFromCode } from "../services/weatherService";

function Forecast({ title, items }) {
  //   console.log(items.length());

  //   const objectLenght = Object.keys(items).length;
  //   console.log(objectLenght);
  //   items.map((item) => console.log(item));
  return (
    <div>
      <div className="flex items-center justify-start mt-6">
        <p className="uppercase text-white font-medium">{title}</p>
      </div>
      <hr className="my-2" />
      <div className="flex flex-row items-center justify-between text-white">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center justify-center"
          >
            <p className="font-light text-sm">{item.title}</p>
            <img
              src={iconUrlFromCode(item.icon)}
              className="w-12 my-1"
              alt=""
            />
            <p className="font-medium">{item.temp.toFixed()}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
