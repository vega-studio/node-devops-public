import React from "react";
import { StoryFn } from "@storybook/react";

import { cvaOptionsToStorybook } from "../../../../util/cva.js";
import { Test2, Test2Cva } from "../../../components/index.js";
import { Test2Props } from "../../data/primitive/test2-props.js";

export default {
  title: "TargetProjectPackage/Primitive/Test2",
  component: Test2,
  args: {},
  argTypes: {
    ...cvaOptionsToStorybook(Test2Cva),
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    containerProps: { table: { disable: true } },
  },
};

const Template = (children?: any) => (args: any) => (
  <Test2 {...args}>{children}</Test2>
);

export const Basic: StoryFn = Template().bind({});
Basic.args = Test2Props();
