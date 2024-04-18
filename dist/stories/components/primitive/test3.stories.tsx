import React from "react";
import { StoryFn } from "@storybook/react";

import { cvaOptionsToStorybook } from "../../../../util/cva.js";
import { Test3, Test3Cva } from "../../../components/index.js";
import { Test3Props } from "../../data/primitive/test3-props.js";

export default {
  title: "Devops/Primitive/Test3",
  component: Test3,
  args: {},
  argTypes: {
    ...cvaOptionsToStorybook(Test3Cva),
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    containerProps: { table: { disable: true } },
  },
};

const Template = (children?: any) => (args: any) => (
  <Test3 {...args}>{children}</Test3>
);

export const Basic: StoryFn = Template().bind({});
Basic.args = Test3Props();
