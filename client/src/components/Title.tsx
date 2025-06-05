import React from "react";
import { Helmet } from "react-helmet-async";

type TitleProps = {
  title: string;
};
function Title({ title }: TitleProps) {
  return (
    <Helmet>
      <title>{`${title} | Fresh Basket`}</title>
    </Helmet>
  );
}

export default Title;
