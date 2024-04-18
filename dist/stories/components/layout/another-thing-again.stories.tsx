import React from "react";
import { StoryFn } from "@storybook/react";

import { cvaOptionsToStorybook } from "../../../../util/cva.js";
import { AnotherThingAgain, AnotherThingAgainCva } from "../../../components/index.js";
import { AnotherThingAgainProps } from "../../data/layout/another-thing-again-props.js";

export default {
  title: "Devops/Layout/AnotherThingAgain",
  component: AnotherThingAgain,
  args: {},
  argTypes: {
    ...cvaOptionsToStorybook(AnotherThingAgainCva),
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    containerProps: { table: { disable: true } },
  },
};

const Template = (children?: any) => (args: any) => (
  <AnotherThingAgain {...args}>{children}</AnotherThingAgain>
);

export const Basic: StoryFn = Template().bind({});
Basic.args = AnotherThingAgainProps();
