import { StoryFn } from "@storybook/react";
import React from "react";

import { cvaOptionsToStorybook } from "../../../../util/cva.js";
import { Test, TestCva } from "../../../components/index.js";
import { TestProps } from "../../data/primitive/test-props.js";

export default {
  title: "Devops/Primitive/Test",
  component: Test,
  tags: ["autodocs"],
  args: {},
  argTypes: {
    ...cvaOptionsToStorybook(TestCva),
    children: { table: { disable: true } },
    // className: { table: { disable: true } },
    // containerProps: { table: { disable: true } },
  },
};

const Template = (children?: any) => (args: any) => (
  <Test {...args}>{children}</Test>
);

export const Basic: StoryFn = Template().bind({});
Basic.args = TestProps();
