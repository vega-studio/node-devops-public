import React from "react";
import { StoryFn } from "@storybook/react";

import { cvaOptionsToStorybook } from "../../../../util/cva.js";
import { TestLayout, TestLayoutCva } from "../../../components/index.js";
import { TestLayoutProps } from "../../data/layout/test-layout-props.js";

export default {
  title: "Devops/Layout/TestLayout",
  component: TestLayout,
  args: {},
  argTypes: {
    ...cvaOptionsToStorybook(TestLayoutCva),
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    containerProps: { table: { disable: true } },
  },
};

const Template = (children?: any) => (args: any) => (
  <TestLayout {...args}>{children}</TestLayout>
);

export const Basic: StoryFn = Template().bind({});
Basic.args = TestLayoutProps();
