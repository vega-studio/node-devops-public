import React from "react";
import { StoryFn } from "@storybook/react";

import { cvaOptionsToStorybook } from "../../../../util/cva.js";
import { AnotherThing, AnotherThingCva } from "../../../components/index.js";
import { AnotherThingProps } from "../../data/layout/another-thing-props.js";

export default {
  title: "Devops/Layout/AnotherThing",
  component: AnotherThing,
  args: {},
  argTypes: {
    ...cvaOptionsToStorybook(AnotherThingCva),
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    containerProps: { table: { disable: true } },
  },
};

const Template = (children?: any) => (args: any) => (
  <AnotherThing {...args}>{children}</AnotherThing>
);

export const Basic: StoryFn = Template().bind({});
Basic.args = AnotherThingProps();
