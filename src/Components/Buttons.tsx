import React from "react";
import "./Buttons";

type Props = {
  onClick: () => void;
  text: string;
};

const Buttons = ({ onClick, text }: Props) => {
  return (
    <div onClick={onClick} className="">
      {text}
    </div>
  );
};

export default Buttons;
